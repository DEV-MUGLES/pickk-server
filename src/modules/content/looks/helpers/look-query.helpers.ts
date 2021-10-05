import { SelectQueryBuilder } from 'typeorm';

import { LookEntity } from '../entities';

// @TODO: 테스트 작성
export const lookBrandIdQuery = (
  queryBuilder: SelectQueryBuilder<LookEntity>,
  brandId: number
) => {
  return queryBuilder
    .innerJoin('digest', 'digest', 'digest.lookId = look.id')
    .innerJoin(
      'item',
      'item',
      `item.id = digest.itemId AND 
      item.brandId = ${brandId}`
    );
};

// @TODO: 테스트 작성
export const lookItemIdQuery = (
  queryBuilder: SelectQueryBuilder<LookEntity>,
  itemId: number
) => {
  return queryBuilder.innerJoin(
    'digest',
    'digest',
    `digest.lookId = look.id AND 
      digest.itemId = ${itemId}`
  );
};

// @TODO: 테스트 작성
export const lookStyleTagsQuery = (
  queryBuilder: SelectQueryBuilder<LookEntity>,
  styleTagIds: number[]
) => {
  if (!styleTagIds?.length) {
    return queryBuilder;
  }

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

export const lookUserHeightQuery = (
  queryBuilder: SelectQueryBuilder<LookEntity>,
  range: [number, number]
) => {
  if (!range) {
    return queryBuilder;
  }

  const [min, max] = range;

  return queryBuilder.innerJoin(
    'user',
    'user',
    `user.id = look.userId AND 
      user.height >= ${min} AND
      user.height <= ${max}`
  );
};
