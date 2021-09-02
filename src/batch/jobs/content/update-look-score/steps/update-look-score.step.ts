import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { MoreThan } from 'typeorm';

import { BaseStep } from '@batch/jobs/base.step';
import { allSettled } from '@common/helpers';

import { LikesRepository } from '@content/likes/likes.repository';
import { LikeOwnerType } from '@content/likes/constants';
import { LooksRepository } from '@content/looks/looks.repository';
import { CommentsRepository } from '@content/comments/comments.repository';
import { CommentOwnerType } from '@content/comments/constants';

import { calculateHitScore, calculateLikeCommentScore } from '../../helpers';
import { UpdateContentScoreType } from '../../constants';

@Injectable()
export class UpdateLookScoreStep extends BaseStep {
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
      select: ['id', 'createdAt', 'score', 'hitCount', 'likeCommentScore'],
    });

    await allSettled(
      looks.map(
        (look) =>
          new Promise(async (resolve, reject) => {
            try {
              const { id, hitCount, createdAt, likeCommentScore } = look;

              const hitScore = calculateHitScore(
                hitCount,
                createdAt,
                UpdateContentScoreType.Look
              );
              const newLikeCommentScore =
                await this.getNewLikeCommentOrderScore(id, likeCommentScore);

              look.score = hitScore + newLikeCommentScore;
              look.likeCommentScore = newLikeCommentScore;
              resolve(look);
            } catch (err) {
              reject(err);
            }
          })
      )
    );
    await this.looksRepository.save(looks);
  }

  async getNewLikeCommentOrderScore(id: number, likeCommentScore: number) {
    const daliyLikeCount = await this.likesRepository.count({
      where: {
        ownerType: LikeOwnerType.Look,
        ownerId: id,
        createdAt: MoreThan(dayjs().add(-1, 'day').toDate()),
      },
    });

    const daliyCommentCount = await this.commentsRepository.count({
      where: {
        ownerType: CommentOwnerType.Look,
        ownerId: id,
        createdAt: MoreThan(dayjs().add(-1, 'day').toDate()),
      },
    });

    return calculateLikeCommentScore(
      daliyLikeCount,
      daliyCommentCount,
      likeCommentScore
    );
  }
}
