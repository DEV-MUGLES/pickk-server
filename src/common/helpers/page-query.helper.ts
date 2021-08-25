import { SelectQueryBuilder } from 'typeorm';

import { PageInput } from '@common/dtos';

// @TODO: 테스트 작성
export const pageQuery = <T extends { id: number }>(
  queryBuilder: SelectQueryBuilder<T>,
  alias: string,
  pageInput?: PageInput
) => {
  if (!pageInput) {
    return queryBuilder;
  }

  if (!pageInput.startId) {
    return queryBuilder
      .offset(pageInput.offset ?? 0)
      .limit(pageInput.limit ?? 20);
  }

  return queryBuilder
    .offset(pageInput.offset ?? 0)
    .limit(pageInput.limit ?? 20)
    .where(`${alias}.id < ${pageInput.startId}`);
};
