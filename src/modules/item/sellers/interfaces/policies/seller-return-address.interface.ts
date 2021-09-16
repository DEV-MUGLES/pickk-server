import { IAddress } from '@common/interfaces';

import { ISeller } from '../seller.interface';

export interface ISellerReturnAddress extends IAddress {
  seller: ISeller;
  sellerId: number;
}
