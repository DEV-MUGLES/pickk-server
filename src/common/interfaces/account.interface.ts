import { BankCode } from '@common/constants';

/**
 * 배송지 정보를 저장합니다.
 *
 * @interface
 */
export interface IAccount {
  /** 은행코드 */
  bankCode: BankCode;
  /** 계좌번호 */
  number: string;
  /** 예금주 이름 */
  ownerName: string;
}
