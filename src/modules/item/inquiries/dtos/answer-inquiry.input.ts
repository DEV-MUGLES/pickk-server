import { InputType, PickType } from '@nestjs/graphql';

import { InquiryAnswerFrom } from '../constants';
import { InquiryAnswer } from '../models';

@InputType()
export class AnswerInquiryInput extends PickType(
  InquiryAnswer,
  ['displayAuthor', 'content'],
  InputType
) {
  from: InquiryAnswerFrom;
  userId: number;
}
