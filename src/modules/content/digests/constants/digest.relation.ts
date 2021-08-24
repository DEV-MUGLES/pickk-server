import { Digest } from '../models';

export type DigestRelationType = keyof Digest;

export const DIGEST_RELATIONS: DigestRelationType[] = [
  'item',
  'user',
  'video',
  'look',
  'itemPropertyValues',
];
