import { Seller } from '../models/seller.model';

export const SELLER_RELATIONS: Array<keyof Seller> = [
  'user',
  'brand',
  'saleStrategy',
  'claimPolicy',
  'crawlPolicy',
  'courier',
  'shippingPolicy',
  'returnAddress',
];
