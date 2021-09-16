import { Field, ObjectType } from '@nestjs/graphql';

import { User } from '@user/users/models';

import { InquiryAnswerEntity } from '../entities';

import { Inquiry } from './inquiry.model';

@ObjectType()
export class InquiryAnswer extends InquiryAnswerEntity {
  @Field(() => Inquiry)
  inquiry: Inquiry;

  @Field(() => User, { nullable: true })
  user: User;
}
