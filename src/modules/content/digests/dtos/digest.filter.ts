import { Field, InputType, Int } from '@nestjs/graphql';

import { IDigest } from '../interfaces';

@InputType()
export class DigestFilter implements Partial<IDigest> {
  @Field(() => Int, { nullable: true })
  itemId?: number;
  @Field(() => Int, { nullable: true })
  userId?: number;

  @Field(() => [Int], { nullable: true })
  idIn?: number[];
  @Field(() => [Int], { nullable: true })
  userIdIn?: number[];

  @Field(() => String, { defaultValue: 'id' })
  orderBy?: keyof IDigest;
}
