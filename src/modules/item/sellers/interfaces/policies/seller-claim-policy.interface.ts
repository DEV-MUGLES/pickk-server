import { IBaseId } from '@common/interfaces';

import { ISeller } from '../seller.interface';

export interface ISellerClaimPolicy extends IBaseId {
  seller: ISeller;
  sellerId: number;

  /** 교환/반품 배송비
   - 전액환불, 반액환불, 0, 직접입력 중 선택해서 진행 가능 */
  fee: number;
  /** 담당자 이름 */
  picName: string;
  /** 담당자 번호 */
  phoneNumber: string;
  description: string;

  isExchangable: boolean;
  isRefundable: boolean;
}
