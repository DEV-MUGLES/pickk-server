import { SelectQueryBuilder } from 'typeorm';

import { CommentOwnerType } from '@content/comments/constants';
import { CommentEntity } from '@content/comments/entities';
import { LikeOwnerType } from '@content/likes/constants';
import { LikeEntity } from '@content/likes/entities';
import { OrderItemEntity } from '@order/order-items/entities';

import {
  likeDiffByIntervalQuery,
  commentDiffByIntervalQuery,
  orderItemDiffByIntervalQuery,
} from '../helpers';

export class CountDiffMap extends Map<number, number> {
  get(key: number) {
    return super.get(key) ?? 0;
  }
}

export class LikeCountDiffMap extends CountDiffMap {
  static async create(
    queryBuilder: SelectQueryBuilder<LikeEntity>,
    ownerType: LikeOwnerType,
    [from, to]: [Date, Date]
  ) {
    return (
      await likeDiffByIntervalQuery(queryBuilder, ownerType, [
        from,
        to,
      ]).getRawMany()
    ).reduce<CountDiffMap>(
      (countDiffMap, { id, diff }) => countDiffMap.set(id, Number(diff)),
      new CountDiffMap()
    );
  }
}

export class CommentCountDiffMap extends CountDiffMap {
  static async create(
    queryBuilder: SelectQueryBuilder<CommentEntity>,
    ownerType: CommentOwnerType,
    [from, to]: [Date, Date]
  ) {
    return (
      await commentDiffByIntervalQuery(queryBuilder, ownerType, [
        from,
        to,
      ]).getRawMany()
    ).reduce(
      (countDiffMap, { id, diff }) => countDiffMap.set(id, Number(diff)),
      new CountDiffMap()
    );
  }
}

export class OrderItemCountDiffMap extends CountDiffMap {
  static async create(
    queryBuilder: SelectQueryBuilder<OrderItemEntity>,
    [from, to]: [Date, Date]
  ) {
    return (
      await orderItemDiffByIntervalQuery(queryBuilder, [from, to]).getRawMany()
    ).reduce(
      (countDiffMap, { id, diff }) => countDiffMap.set(id, Number(diff)),
      new CountDiffMap()
    );
  }
}
