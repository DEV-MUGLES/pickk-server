import { IAddress, IBaseId, ISaleStrategy } from '@common/interfaces';

import { IBrand } from '@item/brands/interfaces';
import { ICourier } from '@item/couriers/interfaces';

import {
  ISellerClaimPolicy,
  ISellerCrawlPolicy,
  ISellerShippingPolicy,
  ISellerSettlePolicy,
} from './policies';
import { ISellerCrawlStrategy } from './seller-crawl-strategy.interface';

export interface ISeller extends IBaseId {
  /** 상호 */
  businessName: string;
  /** 사업자번호 */
  businessCode: string;
  /** 통신판매업신고번호 */
  mailOrderBusinessCode: string;
  /** 대표자 이름 */
  representativeName: string;
  email: string;

  /** 주문 알림톡 수신 번호 */
  orderNotiPhoneNumber?: string;
  /** CS 알림톡 수신 번호 */
  csNotiPhoneNumber?: string;

  /** 고객센터 번호 */
  phoneNumber: string;
  /** 고객센터 운영시간 */
  operationTimeMessage: string;
  /** 고객센터 카카오톡 ID */
  kakaoTalkCode?: string;

  brand: IBrand;
  courier: ICourier;

  saleStrategy: ISaleStrategy;
  crawlStrategy: ISellerCrawlStrategy;

  claimPolicy: ISellerClaimPolicy;
  crawlPolicy: ISellerCrawlPolicy;
  shippingPolicy: ISellerShippingPolicy;
  settlePolicy?: ISellerSettlePolicy;
  returnAddress: IAddress;
}
