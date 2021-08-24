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
    return queryBuilder.skip(pageInput.offset ?? 0).take(pageInput.limit ?? 20);
  }

  return queryBuilder
    .skip(pageInput.offset ?? 0)
    .take(pageInput.limit ?? 20)
    .where(`${alias}.id < ${pageInput.startId}`);
};
