import { DigestsExhibition } from '../models';

export type DigestsExhibitionRelationType =
  | keyof DigestsExhibition
  | 'exhibitionDigests.digest'
  | 'exhibitionDigests.digest.user'
  | 'exhibitionDigests.digest.item'
  | 'exhibitionDigests.digest.item.brand'
  | 'exhibitionDigests.digest.item.prices';

export const DIGESTS_EXHIBITION_RELATIONS: DigestsExhibitionRelationType[] = [
  'exhibitionDigests',
  'exhibitionDigests.digest',
  'exhibitionDigests.digest.user',
  'exhibitionDigests.digest.item',
  'exhibitionDigests.digest.item.brand',
  'exhibitionDigests.digest.item.prices',
];
