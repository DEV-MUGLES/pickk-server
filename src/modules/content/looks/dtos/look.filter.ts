import { Field, InputType, Int } from '@nestjs/graphql';

import { ILook } from '../interfaces';

@InputType()
export class LookFilter implements Partial<ILook> {
  excludeFields: Array<keyof LookFilter> = ['styleTagIdIn'];

  @Field(() => Int, { nullable: true })
  userId: number;

  @Field(() => [Int], { nullable: true })
  styleTagIdIn: number[];
}
