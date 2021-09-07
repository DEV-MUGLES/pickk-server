import { Video } from '../models';

export type VideoRelationType =
  | keyof Video
  | 'digests.item'
  | 'digests.item.brand'
  | 'digests.item.prices'
  | 'digests.item.minorCategory'
  | 'digests.item.urls'
  | 'digests.itemPropertyValues'
  | 'digests.itemPropertyValues.property';

export const VIDEO_RELATIONS: VideoRelationType[] = [
  'user',
  'digests',
  'digests.item',
  'digests.item.brand',
  'digests.item.prices',
  'digests.item.minorCategory',
  'digests.item.urls',
  'digests.itemPropertyValues',
  'digests.itemPropertyValues.property',
];
