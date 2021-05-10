import { InputType, PickType, PartialType } from '@nestjs/graphql';

import { Item } from '../models/item.model';

@InputType()
export class UpdateItemInput extends PartialType(
  PickType(
    Item,
    [
      'name',
      'description',
      'majorCategoryCode',
      'minorCategoryCode',
      'isMdRecommended',
      'isSellable',
    ],
    InputType
  )
) {}
