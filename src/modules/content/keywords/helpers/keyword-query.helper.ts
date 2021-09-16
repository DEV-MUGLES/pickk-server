import { SelectQueryBuilder } from 'typeorm';

import { KeywordEntity } from '../entities';

// @TODO: 테스트 작성
// @FIXME: isOwing === true && !userId인 경우 전체 쿼리를 빈 배열로 반환해야한다.
export const keywordLikingQuery = (
  queryBuilder: SelectQueryBuilder<KeywordEntity>,
  userId?: number,
  isLiking?: boolean
) => {
  if (isLiking == null) {
    return queryBuilder;
  }
  if (!userId) {
    return queryBuilder;
  }

  return queryBuilder
    .leftJoin(
      'like',
      'like',
      `like.ownerType = 'keyword' AND like.ownerId = keyword.id AND like.userId = ${userId}`
    )
    .where(`like.ownerId IS ${isLiking ? 'NOT' : ''} NULL`);
};

// @TODO: 테스트 작성
// @FIXME: isOwing === true && !userId인 경우 전체 쿼리를 빈 배열로 반환해야한다.
export const keywordOwningQuery = (
  queryBuilder: SelectQueryBuilder<KeywordEntity>,
  userId: number,
  isOwning: boolean
) => {
  if (isOwning == null) {
    return queryBuilder;
  }
  if (!userId) {
    return queryBuilder;
  }

  return queryBuilder
    .leftJoin(
      'own',
      'own',
      `own.keywordId = keyword.id AND own.userId = ${userId}`
    )
    .where(`own.keywordId IS ${isOwning ? 'NOT' : ''} NULL`);
};

// @TODO: 테스트 작성
export const keywordClassQuery = (
  queryBuilder: SelectQueryBuilder<KeywordEntity>,
  keywordClassId?: number
) => {
  if (!keywordClassId) {
    return queryBuilder;
  }

  const KEYWORD_CLASSES_TABLE = 'keyword_classes_keyword_class';

  return queryBuilder.innerJoin(
    KEYWORD_CLASSES_TABLE,
    'classes_table',
    `classes_table.keywordId = keyword.id AND classes_table.keywordClassId = ${keywordClassId}`
  );
};
