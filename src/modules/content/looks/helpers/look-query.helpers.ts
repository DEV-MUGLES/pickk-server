import { SelectQueryBuilder } from 'typeorm';

import { LookEntity } from '../entities';

// @TODO: 테스트 작성
export const lookStyleTagsQuery = (
  queryBuilder: SelectQueryBuilder<LookEntity>,
  styleTagIds: number[]
) => {
  const LOOK_STYLETAGS_TABLE = 'look_style_tags_style_tag';

  return queryBuilder
    .leftJoinAndSelect(
      LOOK_STYLETAGS_TABLE,
      'tags_table',
      `tags_table.lookId = look.id AND 
       tags_table.styleTagId IN(${styleTagIds
         .map((id) => `'${id}'`)
         .join(', ')})`
    )
    .where(`tags_table.styleTagId IS NOT NULL`);
};
