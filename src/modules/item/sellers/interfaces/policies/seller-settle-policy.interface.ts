import { IAccount, IBaseId } from '@common/interfaces';

import { ISeller } from '../seller.interface';

export interface ISellerSettlePolicy extends IBaseId {
  seller: ISeller;
  sellerId: number;

  /** 담당자 이름 */
  picName: string;
  /** 담당자 번호 */
  phoneNumber: string;
  /** 정산/세금계산서 수령이메일 */
  email: string;
  /** 정산 받을 게좌 */
  account: IAccount;
  /** 정산률 (0~100)
   * @default 70 */
  rate: number;
}
