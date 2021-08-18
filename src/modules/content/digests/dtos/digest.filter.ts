import { Field, InputType, Int } from '@nestjs/graphql';

import { IDigest } from '../interfaces';

@InputType()
export class DigestFilter implements Partial<IDigest> {
  @Field(() => Int, { nullable: true })
  userId: number;
}
