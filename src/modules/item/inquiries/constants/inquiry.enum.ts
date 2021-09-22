import { registerEnumType } from '@nestjs/graphql';

export enum InquiryType {
  Ship = 'Ship',
  Size = 'Size',
  Restock = 'Restock',
  Etc = 'Etc',
}

registerEnumType(InquiryType, {
  name: 'InquiryType',
  description: '배송/사이즈/재입고/기타',
});
