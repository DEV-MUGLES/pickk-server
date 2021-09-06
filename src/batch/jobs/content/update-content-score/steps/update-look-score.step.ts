import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CommentsRepository } from '@content/comments/comments.repository';
import { CommentOwnerType } from '@content/comments/constants';
import { LikesRepository } from '@content/likes/likes.repository';
import { LikeOwnerType } from '@content/likes/constants';
import { LooksRepository } from '@content/looks/looks.repository';

import { LookHitScore } from '../hit-score';

import { BaseUpdateScoreStep } from './base-update-score.step';

@Injectable()
export class UpdateLookScoreStep extends BaseUpdateScoreStep {
  constructor(
    @InjectRepository(LooksRepository)
    private readonly looksRepository: LooksRepository,
    @InjectRepository(LikesRepository)
    private readonly likesRepository: LikesRepository,
    @InjectRepository(CommentsRepository)
    private readonly commentsRepository: CommentsRepository
  ) {
    super();
  }

  async tasklet() {
    const looks = await this.looksRepository.find({
      select: ['id', 'createdAt', 'score', 'hitCount'],
    });

    await this.setLikeDiffMaps();
    await this.setCommentDiffMaps();

    await Promise.all(
      looks.map(
        (look) =>
          new Promise((resolve) => {
            const { id, hitCount, createdAt } = look;
            const reactionScore = this.calculateReactionScore(id);
            const hitScore = new LookHitScore(hitCount, createdAt).value;

            look.score = hitScore + reactionScore;
            resolve(look);
          })
      )
    );
    await this.looksRepository.save(looks);
  }

  calculateReactionScore(id: number) {
    return (
      this.calculateLikeReactionScore(id) +
      this.calculateCommentReactionScore(id)
    );
  }

  async setLikeDiffMaps() {
    const likesQueryBuilder = this.likesRepository.createQueryBuilder();
    await this.setFirstIntervalLikeCountDiffMap(
      likesQueryBuilder,
      LikeOwnerType.Look
    );
    await this.setSecondIntervalLikeCountDiffMap(
      likesQueryBuilder,
      LikeOwnerType.Look
    );
  }

  async setCommentDiffMaps() {
    const commentsQueryBuilder = this.commentsRepository.createQueryBuilder();
    await this.setFirstIntervalCommentCountDiffMap(
      commentsQueryBuilder,
      CommentOwnerType.Look
    );
    await this.setSecondIntervalCommentCountDiffMap(
      commentsQueryBuilder,
      CommentOwnerType.Look
    );
  }
}
