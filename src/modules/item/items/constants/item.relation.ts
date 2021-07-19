import { Item } from '../models';

export type ItemRelationType =
  | keyof Item
  | 'options.values'
  | 'products.itemOptionValues'
  | 'products.shippingReservePolicy';

export const ITEM_RELATIONS: Array<ItemRelationType> = [
  'brand',
  'urls',
  'options',
  'options.values',
  'detailImages',
  'salePolicy',
  'products',
  'products.itemOptionValues',
  'products.shippingReservePolicy',
  'notice',
  'prices',
  'sizeCharts',
  'majorCategory',
  'minorCategory',
  'campaigns',
];
