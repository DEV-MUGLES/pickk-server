import { IAccount } from '@src/common/interfaces/account.interface';

export interface ISellerSettlePolicy {
  /** 담당자 이름 */
  picName: string;
  /** 담당자 번호 */
  phoneNumber: string;
  /** 세금계산서 수령이메일 */
  email: string;

  /** 정산 게좌 */
  account: IAccount;
}
