import { ObjectType } from '@nestjs/graphql';

import { InquiryAnswerEntity } from '../entities';

@ObjectType()
export class InquiryAnswer extends InquiryAnswerEntity {}
