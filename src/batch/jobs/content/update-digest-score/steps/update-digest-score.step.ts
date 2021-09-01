import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { MoreThan } from 'typeorm';

import { BaseStep } from '@batch/jobs/base.step';
import { allSettled } from '@common/helpers';

import { DigestsRepository } from '@content/digests/digests.repository';
import { LikesRepository } from '@content/likes/likes.repository';
import { LikeOwnerType } from '@content/likes/constants';
import { CommentsRepository } from '@content/comments/comments.repository';
import { CommentOwnerType } from '@content/comments/constants';
import { OrderItemsRepository } from '@order/order-items/order-items.repository';

import {
  calculateHitScore,
  calculateLikeCommentOrderScore,
} from '../../helpers';
import { ScoreUpdateType } from '../../constants';

@Injectable()
export class UpdateDigestScoreStep extends BaseStep {
  constructor(
    @InjectRepository(DigestsRepository)
    private readonly digestsRepository: DigestsRepository,
    @InjectRepository(LikesRepository)
    private readonly likesRepository: LikesRepository,
    @InjectRepository(CommentsRepository)
    private readonly commentsRepository: CommentsRepository,
    @InjectRepository(OrderItemsRepository)
    private readonly orderItemsRepository: OrderItemsRepository
  ) {
    super();
  }

  async tasklet() {
    const digests = await this.digestsRepository.find({
      select: [
        'id',
        'createdAt',
        'item',
        'score',
        'hitCount',
        'likeCommentOrderScore',
      ],
      relations: ['item'],
    });

    await allSettled(
      digests.map(
        (digest) =>
          new Promise(async (resolve, reject) => {
            try {
              const {
                id,
                item: { isSoldout, id: itemId },
                hitCount,
                createdAt,
                likeCommentOrderScore,
              } = digest;

              const hitScore = calculateHitScore(
                hitCount,
                createdAt,
                ScoreUpdateType.Digest
              );
              const newLikeCommentOrderScore =
                await this.getNewLikeCommentOrderScore(
                  id,
                  itemId,
                  likeCommentOrderScore
                );
              const soldOutScore = isSoldout ? -0.5 : 0;

              digest.score = hitScore + newLikeCommentOrderScore + soldOutScore;
              digest.likeCommentOrderScore = newLikeCommentOrderScore;
              resolve(digest);
            } catch (err) {
              reject(err);
            }
          })
      )
    );
    await this.digestsRepository.save(digests);
  }

  async getNewLikeCommentOrderScore(
    id: number,
    itemId: number,
    likeCommentOrderScore: number
  ) {
    const daliyLikeCount = await this.likesRepository.count({
      where: {
        ownerType: LikeOwnerType.Digest,
        ownerId: id,
        createdAt: MoreThan(dayjs().add(-1, 'day').toDate()),
      },
    });

    const daliyCommentCount = await this.commentsRepository.count({
      where: {
        ownerType: CommentOwnerType.Digest,
        ownerId: id,
        createdAt: MoreThan(dayjs().add(-1, 'day').toDate()),
      },
    });

    const daliyOrderItemCount = await this.orderItemsRepository.count({
      where: {
        itemId,
        paidAt: MoreThan(dayjs().add(-1, 'day').toDate()),
      },
    });

    return calculateLikeCommentOrderScore(
      daliyLikeCount,
      daliyCommentCount,
      daliyOrderItemCount,
      likeCommentOrderScore
    );
  }
}
