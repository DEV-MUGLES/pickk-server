import { Keyword } from '../models';

export type KeywordRelationType =
  | keyof Keyword
  | 'looks.images'
  | 'digests.video'
  | 'digests.images'
  | 'digests.item'
  | 'digests.item.brand'
  | 'digests.item.minorCategory'
  | 'digests.itemPropertyValues'
  | 'digests.itemPropertyValues.property'
  | 'digests.user'
  | 'relatedKeywords.digests'
  | 'relatedKeywords.digests.item'
  | 'relatedKeywords.digests.item.brand';

export const KEYWORD_RELATIONS: KeywordRelationType[] = [
  'styleTags',
  'looks',
  'looks.images',
  'digests',
  'digests.video',
  'digests.images',
  'digests.item',
  'digests.item.brand',
  'digests.item.minorCategory',
  'digests.itemPropertyValues',
  'digests.itemPropertyValues.property',
  'digests.user',
  'classes',
  'relatedKeywords',
  'relatedKeywords.digests',
  'relatedKeywords.digests.item',
  'relatedKeywords.digests.item.brand',
];
