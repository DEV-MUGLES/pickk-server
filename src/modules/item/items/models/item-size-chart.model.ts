import { Field, ObjectType } from '@nestjs/graphql';

import { ItemSizeChartEntity } from '../entities';

import { IItemSize, IItemSizeRecommendation } from '../interfaces';

@ObjectType()
export class ItemSizeChart extends ItemSizeChartEntity {
  @Field(() => [String])
  labels: string[];
  @Field(() => [ItemSize])
  sizes: ItemSize[];
  @Field(() => [ItemSizeRecommendation], { nullable: true })
  recommendations: ItemSizeRecommendation[];
}

@ObjectType()
export class ItemSize implements IItemSize {
  @Field()
  name: string;
  @Field(() => [String])
  values: string[];
}

@ObjectType()
export class ItemSizeRecommendation implements IItemSizeRecommendation {
  @Field()
  height: number;
  @Field()
  weight: number;
  @Field()
  sizeName: string;
}
