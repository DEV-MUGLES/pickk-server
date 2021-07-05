import {
  ProductRelationType,
  PRODUCT_RELATIONS,
} from '../../products/constants/product.relation';
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
