import { SelectQueryBuilder } from 'typeorm';

import { CommentOwnerType } from '@content/comments/constants';
import { CommentEntity } from '@content/comments/entities';
import { LikeOwnerType } from '@content/likes/constants';
import { LikeEntity } from '@content/likes/entities';
import { OrderItemEntity } from '@order/order-items/entities';

export function likeDiffByIntervalQuery(
  queryBuilder: SelectQueryBuilder<LikeEntity>,
  ownerType: LikeOwnerType,
  [from, to]: [Date, Date]
) {
  return queryBuilder
    .select('count(ownerId)', 'diff')
    .addSelect('ownerId', 'id')
    .where('ownerType = :ownerType', { ownerType })
    .andWhere('createdAt BETWEEN :from AND :to', {
      from,
      to,
    })
    .groupBy('ownerId');
}

export function commentDiffByIntervalQuery(
  queryBuilder: SelectQueryBuilder<CommentEntity>,
  ownerType: CommentOwnerType,
  [from, to]: [Date, Date]
) {
  return queryBuilder
    .select('count(ownerId)', 'diff')
    .addSelect('ownerId', 'id')
    .where('ownerType = :ownerType', { ownerType })
    .andWhere('createdAt BETWEEN :from AND :to', {
      from,
      to,
    })
    .groupBy('ownerId');
}

export function orderItemDiffByIntervalQuery(
  queryBuilder: SelectQueryBuilder<OrderItemEntity>,
  [from, to]: [Date, Date]
) {
  return queryBuilder
    .select('count(itemId)', 'diff')
    .addSelect('itemId', 'id')
    .where('paidAt BETWEEN :from AND :to', {
      from,
      to,
    })
    .groupBy('itemId');
}
