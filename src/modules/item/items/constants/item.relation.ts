import { Item } from '../models';

export type ItemRelationType =
  | keyof Item
  | 'brand.seller'
  | 'options.values'
  | 'products.itemOptionValues'
  | 'products.shippingReservePolicy'
  | 'itemsGroupItem.group'
  | 'itemsGroupItem.group.groupItems'
  | 'itemsGroupItem.group.groupItems.item';

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
  'itemsGroupItem',
  'itemsGroupItem.group',
  'itemsGroupItem.group.groupItems',
  'itemsGroupItem.group.groupItems.item',
];
