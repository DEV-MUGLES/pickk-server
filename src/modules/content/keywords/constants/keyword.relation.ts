import { Keyword } from '../models';

export type KeywordRelationType =
  | keyof Keyword
  | 'looks.images'
  | 'digests.images'
  | 'digests.item'
  | 'digests.item.brand'
  | 'digests.item.minorCategory'
  | 'digests.itemPropertyValues'
  | 'digests.user'
  | 'relatedKeywords.digests'
  | 'relatedKeywords.digests.item'
  | 'relatedKeywords.digests.item.brand';

export const KEYWORD_RELATIONS: KeywordRelationType[] = [
  'styleTags',
  'looks',
  'looks.images',
  'digests',
  'digests.images',
  'digests.item',
  'digests.item.brand',
  'digests.item.minorCategory',
  'digests.itemPropertyValues',
  'digests.user',
  'classes',
  'relatedKeywords',
  'relatedKeywords.digests',
  'relatedKeywords.digests.item',
  'relatedKeywords.digests.item.brand',
];
