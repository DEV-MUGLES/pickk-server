import { Digest } from '../models';

export type DigestRelationType =
  | keyof Digest
  | 'item.brand'
  | 'item.minorCategory';

export const DIGEST_RELATIONS: DigestRelationType[] = [
  'item',
  'item.brand',
  'item.minorCategory',
  'user',
  'video',
  'look',
  'itemPropertyValues',
];
