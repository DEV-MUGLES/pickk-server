import { registerEnumType } from '@nestjs/graphql';

export enum InquiryType {
  Ship = 'ship',
  Size = 'size',
  Restock = 'restock',
  Etc = 'etc',
}

registerEnumType(InquiryType, {
  name: 'InquiryType',
  description: '배송/사이즈/재입고/기타',
});
