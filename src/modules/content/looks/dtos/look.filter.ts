import { Field, InputType, Int } from '@nestjs/graphql';

import { ILook } from '../interfaces';

@InputType()
export class LookUserFilter {
  @Field(() => [Int, Int], { nullable: true })
  heightBetween: [number, number];
}

@InputType()
export class LookFilter implements Partial<Omit<ILook, 'user'>> {
  excludeFields?: Array<keyof LookFilter | 'heightBetween'> = [
    'styleTagIdIn',
    'itemId',
    'heightBetween',
  ];

  @Field(() => [Int], { nullable: true })
  idIn?: number[];
  @Field(() => Int, { nullable: true })
  userId?: number;
  @Field(() => [Int], { nullable: true })
  userIdIn?: number[];
  @Field(() => LookUserFilter, { nullable: true })
  user?: LookUserFilter;

  @Field(() => Int, {
    description: '사용시 다른 필터는 무시합니다. (정렬: "score")',
    nullable: true,
  })
  itemId?: number;

  @Field(() => [Int], { nullable: true })
  styleTagIdIn?: number[];

  @Field(() => String, { defaultValue: 'id' })
  orderBy?: keyof ILook;
}
