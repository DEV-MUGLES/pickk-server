import { IAccount } from '@common/interfaces';

import { ClaimFeePayMethod } from '../../constants';

export interface ISellerClaimPolicy {
  /** 교환/반품 배송비
   - 전액환불, 반액환불, 0, 직접입력 중 선택해서 진행 가능 */
  fee: number;
  /** 담당자 이름 */
  picName: string;
  /** 담당자 번호 */
  phoneNumber: string;
  /** 교환배송비 지불방식 */
  feePayMethod: ClaimFeePayMethod;

  /** 교환배송비 지불 게좌 */
  account?: IAccount;
}
