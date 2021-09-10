import { registerEnumType } from '@nestjs/graphql';

export enum InquiryAnswerFrom {
  SELLER = 'SELLER',
  ROOT = 'ROOT',
}

registerEnumType(InquiryAnswerFrom, {
  name: 'InquiryAnswerFrom',
  description: '답변 작성 출처입니다. (SELLER or ROOT)',
});
