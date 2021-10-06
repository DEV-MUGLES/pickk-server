import { Item } from '../models';

export type ItemRelationType =
  | keyof Item
  | 'brand.seller'
  | 'options.values'
  | 'products.itemOptionValues'
  | 'products.shippingReservePolicy';

export const ITEM_RELATIONS: Array<ItemRelationType> = [
  'brand',
  'brand.seller',
  'campaigns',
  'urls',
  'options',
  'options.values',
  'detailImages',
  'salePolicy',
  'products',
  'products.itemOptionValues',
  'products.shippingReservePolicy',
  'prices',
  'sizeCharts',
  'majorCategory',
  'minorCategory',
  'campaigns',
];
