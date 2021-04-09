import { Item } from '../models/item.model';

export const ITEM_RELATIONS: Array<
  keyof Item | 'options.values' | 'products.itemOptionValues'
> = [
  'brand',
  'urls',
  'options',
  'options.values',
  'detailImages',
  'salePolicy',
  'products',
  'products.itemOptionValues',
];
