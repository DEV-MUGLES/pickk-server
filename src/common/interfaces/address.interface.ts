/**
 * 배송지 정보를 저장합니다.
 *
 * @interface
 */
export interface IAddress {
  name: string;
  receiverName: string;

  baseAddress: string;
  detailAddress: string;
  postalCode: string;

  phoneNumber1: string;
  phoneNumber2?: string;
}
