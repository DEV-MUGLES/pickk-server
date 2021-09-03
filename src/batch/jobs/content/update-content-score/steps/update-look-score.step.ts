import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseStep } from '@batch/jobs/base.step';
import { allSettled } from '@common/helpers';

import { LikeOwnerType } from '@content/likes/constants';
import { LooksRepository } from '@content/looks/looks.repository';
import { CommentOwnerType } from '@content/comments/constants';

import { calculateHitScore } from '../../helpers';
import { UpdateContentScoreType } from '../../constants';
import { CommentReactionScoreCalculator } from '../reaction-score-calculator/comment.reaction-score-calculator';
import { LikeReactionScoreCalculator } from '../reaction-score-calculator/like.reaction-score-calculator';

@Injectable()
export class UpdateLookScoreStep extends BaseStep {
  constructor(
    @InjectRepository(LooksRepository)
    private readonly looksRepository: LooksRepository,
    private readonly likeReactionScoreCalculator: LikeReactionScoreCalculator,
    private readonly commentReactionScoreCalculator: CommentReactionScoreCalculator
  ) {
    super();
  }

  async tasklet() {
    const looks = await this.looksRepository.find({
      select: ['id', 'createdAt', 'score', 'hitCount'],
    });

    await allSettled(
      looks.map(
        (look) =>
          new Promise(async (resolve, reject) => {
            try {
              const { id, hitCount, createdAt } = look;

              const hitScore = calculateHitScore(
                hitCount,
                createdAt,
                UpdateContentScoreType.Look
              );

              const reactionScore = await this.calculateReactionScore(id);

              look.score = hitScore + reactionScore;

              resolve(look);
            } catch (err) {
              reject(err);
            }
          })
      )
    );
    await this.looksRepository.save(looks);
  }

  async calculateReactionScore(id: number) {
    return (
      (await this.likeReactionScoreCalculator.calculateScore(
        id,
        LikeOwnerType.Look
      )) +
      (await this.commentReactionScoreCalculator.calculateScore(
        id,
        CommentOwnerType.Look
      ))
    );
  }
}
