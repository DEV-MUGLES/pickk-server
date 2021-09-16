import { IBaseId } from '@common/interfaces';

import { ISeller } from './seller.interface';

export interface ISellerCrawlStrategy extends IBaseId {
  seller: ISeller;
  sellerId: number;

  itemsSelector: string;
  codeRegex: string;
  pagination: boolean;
  pageParam?: string;
  baseUrl: string;
  /** spliter: "<>" */
  startPathNamesJoin: string;
}
