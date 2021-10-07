import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CommentOwnerType } from '@content/comments/constants';
import { CommentsRepository } from '@content/comments/comments.repository';
import { DigestsRepository } from '@content/digests/digests.repository';
import { LikeOwnerType } from '@content/likes/constants';
import { LikesRepository } from '@content/likes/likes.repository';
import { OrderItemsRepository } from '@order/order-items/order-items.repository';

import { OrderItemCountDiffMap } from '../count-diff-map';
import { DigestHitScore } from '../hit-score';
import { calculateReactionScore, ReactionScoreWeight } from '../../helpers';

import { BaseUpdateScoreStep } from './base-update-score.step';

@Injectable()
export class UpdateDigestScoreStep extends BaseUpdateScoreStep {
  private firstIntervalOrderItemCountDiffMap: OrderItemCountDiffMap;
  private secondIntervalOrderItemCountDiffMap: OrderItemCountDiffMap;

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
      select: ['id', 'createdAt', 'item', 'score', 'hitCount'],
      relations: ['item'],
    });
    await this.setLikeDiffMaps();
    await this.setCommentDiffMaps();
    await this.setOrderItemDiffMaps();

    for (const digest of digests) {
      const {
        id,
        item: { isSoldout, id: itemId },
        hitCount,
        createdAt,
      } = digest;

      const reactionScore = this.calculateTotalReactionScore(id, itemId);
      const hitScore = new DigestHitScore(hitCount, createdAt).value;
      const soldOutScore = isSoldout ? -0.5 : 0;
      const newScore = Math.max(hitScore + reactionScore + soldOutScore, 0);

      // 스코어가 0.2미만으로 변경되면 변경되지 않도록 함
      const isUpdated =
        Math.floor(digest.score * 20) !== Math.floor(newScore * 20);

      if (isUpdated) {
        await this.digestsRepository.update(digest.id, { score: newScore });
      }
    }
  }

  calculateTotalReactionScore(id: number, itemId: number) {
    const orderItemDiffs = [
      this.firstIntervalOrderItemCountDiffMap.get(itemId),
      this.secondIntervalOrderItemCountDiffMap.get(itemId),
    ];

    return (
      calculateReactionScore(orderItemDiffs, ReactionScoreWeight.Order) +
      this.calculateCommentReactionScore(id) +
      this.calculateLikeReactionScore(id)
    );
  }

  async setLikeDiffMaps() {
    const likesQueryBuilder = this.likesRepository.createQueryBuilder();
    await this.setFirstIntervalLikeCountDiffMap(
      likesQueryBuilder,
      LikeOwnerType.Digest
    );
    await this.setSecondIntervalLikeCountDiffMap(
      likesQueryBuilder,
      LikeOwnerType.Digest
    );
  }

  async setCommentDiffMaps() {
    const commentsQueryBuilder = this.commentsRepository.createQueryBuilder();
    await this.setFirstIntervalCommentCountDiffMap(
      commentsQueryBuilder,
      CommentOwnerType.Digest
    );
    await this.setSecondIntervalCommentCountDiffMap(
      commentsQueryBuilder,
      CommentOwnerType.Digest
    );
  }

  async setOrderItemDiffMaps() {
    const orderItemsQueryBuilder =
      this.orderItemsRepository.createQueryBuilder();
    this.firstIntervalOrderItemCountDiffMap =
      await OrderItemCountDiffMap.create(
        orderItemsQueryBuilder,
        this.firstInterval
      );
    this.secondIntervalOrderItemCountDiffMap =
      await OrderItemCountDiffMap.create(
        orderItemsQueryBuilder,
        this.secondInterval
      );
  }
}
