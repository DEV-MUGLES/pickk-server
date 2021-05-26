import { registerEnumType } from '@nestjs/graphql';

export enum ClaimFeePayMethod {
  Trans = 'trans',
  Enclose = 'enclose',
}

registerEnumType(ClaimFeePayMethod, {
  name: 'ClaimFeePayMethod',
  description:
    '교환/반품 배송비 지불 방식. (Trans:계좌입금, Enclose:택배상자 동봉)',
});
