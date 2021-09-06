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
    interval: Date[]
  ) {
    return (
      await likeDiffByIntervalQuery(
        queryBuilder,
        ownerType,
        interval
      ).getRawMany()
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
    interval: Date[]
  ) {
    return (
      await commentDiffByIntervalQuery(
        queryBuilder,
        ownerType,
        interval
      ).getRawMany()
    ).reduce(
      (countDiffMap, { id, diff }) => countDiffMap.set(id, Number(diff)),
      new CountDiffMap()
    );
  }
}

export class OrderItemCountDiffMap extends CountDiffMap {
  static async create(
    queryBuilder: SelectQueryBuilder<OrderItemEntity>,
    interval: Date[]
  ) {
    return (
      await orderItemDiffByIntervalQuery(queryBuilder, interval).getRawMany()
    ).reduce(
      (countDiffMap, { id, diff }) => countDiffMap.set(id, Number(diff)),
      new CountDiffMap()
    );
  }
}
