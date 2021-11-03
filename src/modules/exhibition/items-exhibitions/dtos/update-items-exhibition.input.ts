import { InputType, PickType } from '@nestjs/graphql';

import { ItemsExhibition } from '../models';

@InputType()
export class UpdateItemsExhibitionInput extends PickType(
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
  ],
  InputType
) {}
