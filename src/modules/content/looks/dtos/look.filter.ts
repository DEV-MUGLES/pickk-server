import { Field, InputType, Int } from '@nestjs/graphql';

import { ILook } from '../interfaces';

@InputType()
export class LookFilter implements Partial<ILook> {
  @Field(() => Int, { nullable: true })
  userId: number;
}
