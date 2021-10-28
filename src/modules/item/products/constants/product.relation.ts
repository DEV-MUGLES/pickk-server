import { Item } from '@item/items/models';

import { Product } from '../models';

export type ProductRelationType =
  | keyof Product
  | `item.${keyof Item}`
  | 'item.brand.seller'
  | 'item.brand.seller.shippingPolicy'
  | 'item.brand.seller.settlePolicy'
  | 'item.brand.seller.saleStrategy';

export const PRODUCT_RELATIONS: Array<ProductRelationType> = [
  'shippingReservePolicy',
  'itemOptionValues',
  'item',
  'item.campaigns',
  'item.detailImages',
  'item.prices',
  'item.options',
  'item.brand',
  'item.brand.seller',
  'item.brand.seller.shippingPolicy',
  'item.brand.seller.settlePolicy',
  'item.brand.seller.saleStrategy',
];

export const REGISTER_ORDER_PRODUCT_RELATIONS: Array<ProductRelationType> =
  PRODUCT_RELATIONS.filter(
    (relation) =>
      relation !== 'item.detailImages' && relation !== 'item.options'
  );
