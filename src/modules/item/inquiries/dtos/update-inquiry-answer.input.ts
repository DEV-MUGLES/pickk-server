import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { InquiryAnswer } from '../models';

@InputType()
export class UpdateInquiryAnswerInput extends PartialType(
  PickType(InquiryAnswer, ['content', 'displayAuthor'], InputType)
) {}
