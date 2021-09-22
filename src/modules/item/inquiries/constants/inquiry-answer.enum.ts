import { registerEnumType } from '@nestjs/graphql';

export enum InquiryAnswerFrom {
  Seller = 'Seller',
  Root = 'Root',
}

registerEnumType(InquiryAnswerFrom, {
  name: 'InquiryAnswerFrom',
  description: '답변 작성 출처입니다. (Seller or Root)',
});
