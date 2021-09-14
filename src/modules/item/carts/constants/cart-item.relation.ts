import {
  ProductRelationType,
  PRODUCT_RELATIONS,
} from '@item/products/constants';

import { CartItem } from '../models';

export type CartItemRelationType =
  | keyof CartItem
  | `product.${ProductRelationType}`
  | 'products.itemOptionValues'
  | 'products.shippingReservePolicy';

export const CART_ITEM_RELATIONS: Array<CartItemRelationType> = [
  'user',
  'product',
  ...PRODUCT_RELATIONS.filter(
    (relation) => relation !== 'item.detailImages'
  ).map((relation) => `product.${relation}` as CartItemRelationType),
];

export const REGISTER_ORDER_CART_ITEM_RELATIONS: Array<CartItemRelationType> =
  CART_ITEM_RELATIONS.filter((relation) => relation !== 'user');
