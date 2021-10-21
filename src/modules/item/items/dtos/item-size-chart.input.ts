import { Field, InputType, PickType } from '@nestjs/graphql';

import { ItemSize, ItemSizeChart, ItemSizeRecommendation } from '../models';

@InputType()
class ItemSizeInput extends PickType(ItemSize, ['name', 'values'], InputType) {}

@InputType()
class ItemSizeRecommendationInput extends PickType(
  ItemSizeRecommendation,
  ['height', 'sizeName', 'weight'],
  InputType
) {}

@InputType()
export class CreateItemSizeChartInput extends PickType(
  ItemSizeChart,
  ['labels'],
  InputType
) {
  @Field(() => [ItemSizeInput])
  sizes: ItemSizeInput[];
  @Field(() => [ItemSizeRecommendationInput], { nullable: true })
  recommendations: ItemSizeRecommendationInput[];
}

@InputType()
export class UpdateItemSizeChartInput extends CreateItemSizeChartInput {}
