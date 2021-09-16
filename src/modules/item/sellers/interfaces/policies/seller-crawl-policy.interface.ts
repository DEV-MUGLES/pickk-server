import { IBaseId } from '@common/interfaces';

import { ISeller } from '../seller.interface';

export interface ISellerCrawlPolicy extends IBaseId {
  seller: ISeller;
  sellerId: number;

  isInspectingNew: boolean;
  isUpdatingItems: boolean;
}
