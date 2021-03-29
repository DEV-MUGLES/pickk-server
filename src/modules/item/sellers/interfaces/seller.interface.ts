import { IAddress } from '@src/common/interfaces/address.interface';
import { ISaleStrategy } from '@src/common/interfaces/sale-strategy.interface';

import {
  ISellerClaimPolicy,
  ISellerCrawlPolicy,
  ISellerShippingPolicy,
} from './policies';

export interface ISeller {
  businessName: string;
  businessCode: string;
  mailOrderBusinessCode: string;
  representativeName: string;
  phoneNumber: string;
  email: string;
  kakaoTalkCode?: string;
  operationTimeMessage: string;

  saleStrategy: ISaleStrategy;
  claimPolicy: ISellerClaimPolicy;
  crawlPolicy: ISellerCrawlPolicy;
  shippingPolicy: ISellerShippingPolicy;

  returnAddress: IAddress;
}
