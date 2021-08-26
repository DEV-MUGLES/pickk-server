import { Field, InputType, Int } from '@nestjs/graphql';

import { ILook } from '../interfaces';

@InputType()
export class LookUserFilter {
  @Field(() => [Int, Int], { nullable: true })
  heightBetween: [number, number];
}

@InputType()
export class LookFilter implements Partial<Omit<ILook, 'user'>> {
  excludeFields?: Array<keyof LookFilter> = ['styleTagIdIn'];

  @Field(() => [Int], { nullable: true })
  idIn?: number[];
  @Field(() => Int, { nullable: true })
  userId?: number;
  @Field(() => [Int], { nullable: true })
  userIdIn?: number[];
  @Field(() => LookUserFilter, { nullable: true })
  user?: LookUserFilter;

  @Field(() => [Int], { nullable: true })
  styleTagIdIn?: number[];

  @Field(() => String, { defaultValue: 'id' })
  orderBy?: keyof ILook;
}
