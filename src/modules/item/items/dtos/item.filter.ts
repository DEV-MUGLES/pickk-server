import { Field, InputType, Int } from '@nestjs/graphql';

import { IItem } from '../interfaces';
import { Item } from '../models';

@InputType()
export class ItemFilter implements Partial<IItem> {
  excludeFields?: ['orderBy'];

  searchFields?: Array<keyof Item> = ['name'];

  @Field({ nullable: true })
  isMdRecommended?: boolean;

  @Field({ nullable: true })
  isSellable?: boolean;

  @Field({ nullable: true })
  isPurchasable?: boolean;

  @Field({ nullable: true })
  majorCategoryId?: number;

  @Field({ nullable: true })
  minorCategoryId?: number;

  @Field({ nullable: true, description: '아이템 이름(name)으로 검색합니다.' })
  search?: string;

  @Field(() => [Int], { nullable: true })
  idIn?: number[];
  @Field({ nullable: true })
  scoreMt?: number;

  @Field(() => [Date, Date], { nullable: true })
  sellableAtBetween?: [Date, Date];
  @Field({ nullable: true })
  sellableAtMte?: Date;
  @Field({ nullable: true })
  sellableAtLte?: Date;
  @Field(() => [Date, Date], { nullable: true })
  createdAtBetween?: [Date, Date];
  @Field({ nullable: true })
  createdAtMte?: Date;
  @Field({ nullable: true })
  createdAtLte?: Date;

  @Field(() => Int, {
    nullable: true,
  })
  brandId?: number;

  @Field(() => String, { nullable: true })
  orderBy?: keyof IItem;
}
