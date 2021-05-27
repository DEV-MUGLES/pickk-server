import { Seller } from '../models/seller.model';

export const SELLER_RELATIONS: Array<keyof Seller | 'claimPolicy.account'> = [
  'user',
  'brand',
  'saleStrategy',
  'crawlStrategy',
  'claimPolicy',
  'claimPolicy.account',
  'crawlPolicy',
  'courier',
  'shippingPolicy',
  'returnAddress',
];
