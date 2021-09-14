import { Field, InputType, Int } from '@nestjs/graphql';

import { IDigest } from '../interfaces';

@InputType()
export class DigestItemFilter {
  @Field(() => Int, { nullable: true })
  minorCategoryId?: number;
}

@InputType()
export class DigestUserFilter {
  @Field(() => [Int, Int], { nullable: true })
  heightBetween?: [number, number];
}

@InputType()
export class DigestFilter implements Partial<Omit<IDigest, 'item' | 'user'>> {
  excludeFields?: Array<
    keyof DigestFilter | 'minorCategoryId' | 'heightBetween'
  > = ['minorCategoryId', 'heightBetween'];

  @Field(() => Int, { nullable: true })
  itemId?: number;
  @Field(() => Int, { nullable: true })
  userId?: number;

  @Field(() => [Int], { nullable: true })
  idIn?: number[];
  @Field(() => [Int], { nullable: true })
  userIdIn?: number[];
  @Field(() => DigestItemFilter, { nullable: true })
  item?: DigestItemFilter;
  @Field(() => DigestUserFilter, { nullable: true })
  user?: DigestUserFilter;

  @Field({ nullable: true })
  ratingIsNull?: boolean;

  @Field(() => String, { defaultValue: 'id' })
  orderBy?: keyof IDigest;

  get hasCustom(): boolean {
    return (
      this.item?.minorCategoryId != null || this.user?.heightBetween != null
    );
  }

  get cacheKey(): string {
    const { item, user } = this;

    return JSON.stringify({
      minorCategoryId: item?.minorCategoryId,
      heightBetween: user?.heightBetween,
    });
  }
}
