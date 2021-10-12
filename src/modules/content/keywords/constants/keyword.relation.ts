import { Keyword } from '../models';

export type KeywordRelationType =
  | keyof Keyword
  | 'looks.images'
  | 'looks.user'
  | 'keywordLooks.look'
  | 'keywordLooks.look.images'
  | 'keywordLooks.look.user'
  | 'digests.video'
  | 'digests.images'
  | 'digests.item'
  | 'digests.item.brand'
  | 'digests.item.minorCategory'
  | 'digests.itemPropertyValues'
  | 'digests.itemPropertyValues.property'
  | 'digests.user'
  | 'keywordDigests.digest'
  | 'keywordDigests.digest.video'
  | 'keywordDigests.digest.images'
  | 'keywordDigests.digest.item'
  | 'keywordDigests.digest.item.brand'
  | 'keywordDigests.digest.item.minorCategory'
  | 'keywordDigests.digest.itemPropertyValues'
  | 'keywordDigests.digest.itemPropertyValues.property'
  | 'keywordDigests.digest.user'
  | 'relatedKeywords.digests'
  | 'relatedKeywords.digests.item'
  | 'relatedKeywords.digests.item.brand'
  | 'relatedKeywords.keywordDigests'
  | 'relatedKeywords.keywordDigests.digest'
  | 'relatedKeywords.keywordDigests.digest.item'
  | 'relatedKeywords.keywordDigests.digest.item.brand';

export const KEYWORD_RELATIONS: KeywordRelationType[] = [
  'styleTags',
  'looks',
  'looks.images',
  'looks.user',
  'keywordLooks',
  'keywordLooks.look',
  'keywordLooks.look.images',
  'keywordLooks.look.user',
  'digests',
  'digests.video',
  'digests.images',
  'digests.item',
  'digests.item.brand',
  'digests.item.minorCategory',
  'digests.itemPropertyValues',
  'digests.itemPropertyValues.property',
  'digests.user',
  'keywordDigests',
  'keywordDigests.digest',
  'keywordDigests.digest.video',
  'keywordDigests.digest.images',
  'keywordDigests.digest.item',
  'keywordDigests.digest.item.brand',
  'keywordDigests.digest.item.minorCategory',
  'keywordDigests.digest.itemPropertyValues',
  'keywordDigests.digest.itemPropertyValues.property',
  'keywordDigests.digest.user',
  'classes',
  'relatedKeywords',
  'relatedKeywords.digests',
  'relatedKeywords.digests.item',
  'relatedKeywords.digests.item.brand',
  'relatedKeywords.keywordDigests',
  'relatedKeywords.keywordDigests.digest',
  'relatedKeywords.keywordDigests.digest.item',
  'relatedKeywords.keywordDigests.digest.item.brand',
];
