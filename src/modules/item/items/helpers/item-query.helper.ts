import { SelectQueryBuilder } from 'typeorm';

import { ReviewItemFilter } from '../dtos';
import { ItemEntity } from '../entities';

export const reviewedItemsQuery = (
  queryBuilder: SelectQueryBuilder<ItemEntity>,
  filter: ReviewItemFilter
) => {
  const { orderByDigestRating, reviewerId } = filter;
  const chunks = ['item.score > 0'];
  reviewerId && chunks.push(`digest.userId = ${reviewerId}`);
  orderByDigestRating && chunks.push(`digest.rating IS NOT NULL`);

  queryBuilder
    .leftJoinAndSelect('item.prices', 'price')
    .leftJoinAndSelect('item.brand', 'brand')
    .innerJoin('digest', 'digest', 'digest.itemId = item.id')
    .where(chunks.join(' AND '))
    .groupBy('item.id')
    .addGroupBy('price.id')
    .orderBy('item.score', 'DESC');

  if (orderByDigestRating) {
    queryBuilder
      .addSelect('MAX(digest.rating)', 'maxDigestRating')
      .orderBy('maxDigestRating', 'DESC')
      .addOrderBy('item.score', 'DESC');
  }

  return queryBuilder;
};
