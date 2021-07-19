import { Item } from '@item/items/models';

import { Product } from '../models/product.model';

export type ProductRelationType =
  | keyof Product
  | `item.${keyof Item}`
  | 'item.brand.seller'
  | 'item.brand.seller.shippingPolicy';

export const PRODUCT_RELATIONS: Array<ProductRelationType> = [
  'itemOptionValues',
  'item',
  'item.detailImages',
  'item.prices',
  'item.options',
  'item.brand',
  'item.brand.seller',
  'item.brand.seller.shippingPolicy',
];
