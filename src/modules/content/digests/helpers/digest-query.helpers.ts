import { SelectQueryBuilder } from 'typeorm';

import { DigestItemFilter } from '../dtos';
import { DigestEntity } from '../entities';

// @TODO: 테스트 작성
export const digestItemQuery = (
  queryBuilder: SelectQueryBuilder<DigestEntity>,
  itemFilter: DigestItemFilter
) => {
  if (
    itemFilter?.brandId == null &&
    itemFilter?.majorCategoryId == null &&
    itemFilter?.minorCategoryId == null
  ) {
    return queryBuilder;
  }

  const { brandId, majorCategoryId, minorCategoryId } = itemFilter;

  const chunks = ['item.id = digest.itemId'];
  brandId && chunks.push(`item.brandId = ${brandId}`);
  majorCategoryId && chunks.push(`item.majorCategoryId = ${majorCategoryId}`);
  minorCategoryId && chunks.push(`item.minorCategoryId = ${minorCategoryId}`);

  return queryBuilder.innerJoin('item', 'item', chunks.join(' AND '));
};

export const digestUserHeightQuery = (
  queryBuilder: SelectQueryBuilder<DigestEntity>,
  range: [number, number]
) => {
  if (range?.length !== 2) {
    return queryBuilder;
  }

  const [min, max] = range;

  return queryBuilder.innerJoin(
    'user',
    'user',
    `user.id = digest.userId AND 
        user.height >= ${min} AND
        user.height <= ${max}`
  );
};
