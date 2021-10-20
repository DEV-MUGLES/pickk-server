import { Field, InputType, Int, PickType } from '@nestjs/graphql';

import { ItemSize, ItemSizeRecommendation } from '../models';

@InputType()
class ItemSizeInput extends PickType(ItemSize, ['name', 'values'], InputType) {}

@InputType()
class ItemSizeRecommendationInput extends PickType(
  ItemSizeRecommendation,
  ['height', 'sizeName', 'weight'],
  InputType
) {}

@InputType()
export class CreateItemSizeChartInput {
  @Field(() => [String])
  labels: string[];
  @Field(() => [ItemSizeInput])
  sizes: ItemSizeInput[];
  @Field(() => [ItemSizeRecommendationInput], { nullable: true })
  recommendations: ItemSizeRecommendationInput[];
}

@InputType()
export class UpdateItemSizeChartInput extends CreateItemSizeChartInput {}
