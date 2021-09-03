import { Digest } from '../models';

export type DigestRelationType =
  | keyof Digest
  | 'item.brand'
  | 'item.minorCategory'
  | 'item.minorCategory'
  | 'itemPropertyValues.property';

export const DIGEST_RELATIONS: DigestRelationType[] = [
  'images',
  'user',
  'video',
  'look',
  'item',
  'item.brand',
  'item.minorCategory',
  'itemPropertyValues',
  'itemPropertyValues.property',
];
