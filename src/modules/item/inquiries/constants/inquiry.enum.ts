import { registerEnumType } from '@nestjs/graphql';

export enum InquiryType {
  SHIP = 'SHIP',
  SIZE = 'SIZE',
  RESTOCK = 'RESTOCK',
  ETC = 'ETC',
}

registerEnumType(InquiryType, {
  name: 'InquiryType',
  description: '배송/사이즈/재입고/기타',
});
