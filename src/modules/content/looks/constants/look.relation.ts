import { Look } from '../models';

export type LookRelationType =
  | keyof Look
  | 'digests.item'
  | 'digests.item.brand'
  | 'digests.item.prices'
  | 'digests.item.minorCategory'
  | 'digests.item.urls'
  | 'digests.itemPropertyValues'
  | 'digests.itemPropertyValues.property';

export const LOOK_RELATIONS: LookRelationType[] = [
  'user',
  'styleTags',
  'images',
  'digests',
  'digests.item',
  'digests.item.brand',
  'digests.item.prices',
  'digests.item.minorCategory',
  'digests.item.urls',
  'digests.itemPropertyValues',
  'digests.itemPropertyValues.property',
];
