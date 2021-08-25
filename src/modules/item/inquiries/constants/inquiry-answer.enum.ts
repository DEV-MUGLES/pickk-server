import { registerEnumType } from '@nestjs/graphql';

export enum InquiryAnswerFrom {
  Seller = 'seller',
  Super = 'super',
}

registerEnumType(InquiryAnswerFrom, {
  name: 'InquiryAnswerFrom',
  description: '답변 작성 출처입니다. (super or seller)',
});
