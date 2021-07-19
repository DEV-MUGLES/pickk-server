import { Seller } from '../models';

export type SellerRelationType =
  | keyof Seller
  | 'claimPolicy.account'
  | 'settlePolicy.account';

export const SELLER_RELATIONS: SellerRelationType[] = [
  'user',
  'brand',
  'saleStrategy',
  'crawlStrategy',
  'claimPolicy',
  'claimPolicy.account',
  'settlePolicy',
  'settlePolicy.account',
  'crawlPolicy',
  'courier',
  'shippingPolicy',
  'returnAddress',
];
