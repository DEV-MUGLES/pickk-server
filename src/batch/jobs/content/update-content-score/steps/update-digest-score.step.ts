import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseStep } from '@batch/jobs/base.step';
import { allSettled } from '@common/helpers';

import { DigestsRepository } from '@content/digests/digests.repository';
import { LikeOwnerType } from '@content/likes/constants';
import { CommentOwnerType } from '@content/comments/constants';

import { calculateHitScore } from '../../helpers';
import { UpdateContentScoreType } from '../../constants';
import { CommentReactionScoreCalculator } from '../reaction-score-calculator/comment.reaction-score-calculator';
import { LikeReactionScoreCalculator } from '../reaction-score-calculator/like.reaction-score-calculator';
import { OrderReactionScoreCalculator } from '../reaction-score-calculator/order.reaction-score-calculator';

@Injectable()
export class UpdateDigestScoreStep extends BaseStep {
  constructor(
    @InjectRepository(DigestsRepository)
    private readonly digestsRepository: DigestsRepository,
    private readonly likeReactionScoreCalculator: LikeReactionScoreCalculator,
    private readonly commentReactionScoreCalculator: CommentReactionScoreCalculator,
    private readonly orderReactionScoreCalculator: OrderReactionScoreCalculator
  ) {
    super();
  }

  async tasklet() {
    const digests = await this.digestsRepository.find({
      select: ['id', 'createdAt', 'item', 'score', 'hitCount'],
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
              } = digest;

              const hitScore = calculateHitScore(
                hitCount,
                createdAt,
                UpdateContentScoreType.Digest
              );
              const reactionScore = await this.calculateReactionScore(
                id,
                itemId
              );
              const soldOutScore = isSoldout ? -0.5 : 0;

              digest.score = hitScore + reactionScore + soldOutScore;

              resolve(digest);
            } catch (err) {
              reject(err);
            }
          })
      )
    );
    await this.digestsRepository.save(digests);
  }

  async calculateReactionScore(id: number, itemId: number) {
    return (
      (await this.likeReactionScoreCalculator.calculateScore(
        id,
        LikeOwnerType.Digest
      )) +
      (await this.commentReactionScoreCalculator.calculateScore(
        id,
        CommentOwnerType.Digest
      )) +
      (await this.orderReactionScoreCalculator.calculateScore(itemId))
    );
  }
}
