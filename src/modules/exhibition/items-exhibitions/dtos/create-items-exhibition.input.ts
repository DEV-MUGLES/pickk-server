import { Field, InputType, Int, PickType } from '@nestjs/graphql';

import { ItemsExhibition } from '../models';

@InputType()
export class CreateItemsExhibitionInput extends PickType(
  ItemsExhibition,
  [
    'title',
    'description',
    'imageUrl',
    'imageTop',
    'imageRight',
    'backgroundColor',
    'isVisible',
    'order',
    'videoId',
  ],
  InputType
) {
  @Field(() => [Int])
  itemIds: number[];
}
