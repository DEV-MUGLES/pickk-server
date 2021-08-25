import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';

import { ILook } from '../interfaces';

@InputType()
export class LookUserFilter {
  @Field(() => [Int, Int], { nullable: true })
  heightBetween: [number, number];
}

export enum LookOrderBy {
  Id = 'id',
  Score = 'score',
}

registerEnumType(LookOrderBy, {
  name: 'LookOrderBy',
});

@InputType()
export class LookFilter implements Partial<Omit<ILook, 'user'>> {
  excludeFields: Array<keyof LookFilter> = ['styleTagIdIn', 'orderBy'];

  @Field(() => Int, { nullable: true })
  userId: number;
  @Field(() => LookUserFilter, { nullable: true })
  user: LookUserFilter;

  @Field(() => [Int], { nullable: true })
  styleTagIdIn: number[];

  @Field(() => LookOrderBy, { defaultValue: LookOrderBy.Id })
  orderBy: LookOrderBy;
}
