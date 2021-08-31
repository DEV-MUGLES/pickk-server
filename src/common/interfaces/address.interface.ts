/**
 * 배송지 정보를 저장합니다.
 *
 * @interface
 */
export interface IAddress {
  name: string;
  receiverName: string;
  phoneNumber: string;

  baseAddress: string;
  detailAddress: string;
  postalCode: string;
}
