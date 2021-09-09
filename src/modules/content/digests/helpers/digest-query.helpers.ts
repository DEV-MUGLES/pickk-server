import { SelectQueryBuilder } from 'typeorm';

import { DigestEntity } from '../entities';

// @TODO: 테스트 작성
export const digestItemMinorCategoryIdQuery = (
  queryBuilder: SelectQueryBuilder<DigestEntity>,
  minorCategoryId: number
) => {
  if (!minorCategoryId) {
    return queryBuilder;
  }

  return queryBuilder.innerJoin(
    'item',
    'item',
    `item.id = digest.itemId AND 
        item.minorCategoryId = ${minorCategoryId}`
  );
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
