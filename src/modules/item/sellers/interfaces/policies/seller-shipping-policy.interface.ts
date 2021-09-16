import { IBaseId } from '@common/interfaces';

import { ISeller } from '../seller.interface';

export interface ISellerShippingPolicy extends IBaseId {
  seller: ISeller;
  sellerId: number;

  minimumAmountForFree: number;
  fee: number;
  description: string;
}
