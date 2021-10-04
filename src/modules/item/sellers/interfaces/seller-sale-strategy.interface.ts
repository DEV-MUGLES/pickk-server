import { ISaleStrategy } from '@common/interfaces';

import { ISeller } from './seller.interface';

export interface ISellerSaleStrategy extends ISaleStrategy {
  seller: ISeller;
  sellerId: number;

  pickkDiscountRate: number;
}
