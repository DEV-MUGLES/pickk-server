import { InputType, PickType } from '@nestjs/graphql';

import { ItemOptionValue } from '../models';

@InputType()
export class CreateItemOpionValueInput extends PickType(
  ItemOptionValue,
  ['name', 'priceVariant'],
  InputType
) {}
