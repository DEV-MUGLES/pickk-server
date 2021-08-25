import { Field, InputType, Int } from '@nestjs/graphql';

import { IUser } from '../interfaces';

@InputType()
export class UserFilter implements Partial<IUser> {
  excludeFields? = ['orderBy'];

  @Field({ nullable: true })
  nickname?: string;

  @Field(() => [Int], { nullable: true })
  idIn?: number[];

  orderBy?: keyof IUser;
}
