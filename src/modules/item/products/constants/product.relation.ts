import { Item } from '@item/items/models';

import { Product } from '../models';

export type ProductRelationType =
  | keyof Product
  | `item.${keyof Item}`
  | 'item.brand.seller'
  | 'item.brand.seller.shippingPolicy';

export const PRODUCT_RELATIONS: Array<ProductRelationType> = [
  'shippingReservePolicy',
  'itemOptionValues',
  'item',
  'item.detailImages',
  'item.prices',
  'item.options',
  'item.brand',
  'item.brand.seller',
  'item.brand.seller.shippingPolicy',
];

export const REGISTER_ORDER_PRODUCT_RELATIONS: Array<ProductRelationType> =
  PRODUCT_RELATIONS.filter(
    (relation) =>
      relation !== 'item.detailImages' && relation !== 'item.options'
  );
