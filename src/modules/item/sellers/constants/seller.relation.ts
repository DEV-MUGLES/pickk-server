import { Seller } from '../models';

export type SellerRelationType = keyof Seller | 'settlePolicy.account';

export const SELLER_RELATIONS: SellerRelationType[] = [
  'user',
  'brand',
  'saleStrategy',
  'crawlStrategy',
  'claimPolicy',
  'settlePolicy',
  'settlePolicy.account',
  'crawlPolicy',
  'courier',
  'shippingPolicy',
  'returnAddress',
];
