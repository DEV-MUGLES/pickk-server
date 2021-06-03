import { Seller } from '../models/seller.model';

export const SELLER_RELATIONS: Array<
  keyof Seller | 'claimPolicy.account' | 'settlePolicy.account'
> = [
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
