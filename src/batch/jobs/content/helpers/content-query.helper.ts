import { SelectQueryBuilder } from 'typeorm';

import { CommentOwnerType } from '@content/comments/constants';
import { CommentEntity } from '@content/comments/entities';
import { LikeOwnerType } from '@content/likes/constants';
import { LikeEntity } from '@content/likes/entities';
import { OrderItemEntity } from '@order/order-items/entities';

export function likeDiffByIntervalQuery(
  queryBuilder: SelectQueryBuilder<LikeEntity>,
  ownerType: LikeOwnerType,
  interval: Date[]
) {
  return queryBuilder
    .select('count(ownerId)', 'diff')
    .addSelect('ownerId', 'id')
    .where('ownerType = :ownerType', { ownerType })
    .andWhere('createdAt BETWEEN :from AND :to', {
      from: interval[0],
      to: interval[1],
    })
    .groupBy('ownerId');
}

export function commentDiffByIntervalQuery(
  queryBuilder: SelectQueryBuilder<CommentEntity>,
  ownerType: CommentOwnerType,
  interval: Date[]
) {
  return queryBuilder
    .select('count(ownerId)', 'diff')
    .addSelect('ownerId', 'id')
    .where('ownerType = :ownerType', { ownerType })
    .andWhere('created_at BETWEEN :from AND :to', {
      from: interval[0],
      to: interval[1],
    })
    .groupBy('ownerId');
}

export function orderItemDiffByIntervalQuery(
  queryBuilder: SelectQueryBuilder<OrderItemEntity>,
  interval: Date[]
) {
  return queryBuilder
    .select('count(itemId)', 'diff')
    .addSelect('itemId', 'id')
    .where('paidAt BETWEEN :from AND :to', {
      from: interval[0],
      to: interval[1],
    })
    .groupBy('itemId');
}
