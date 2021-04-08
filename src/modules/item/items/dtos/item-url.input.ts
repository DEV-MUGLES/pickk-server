import { InputType, PickType } from '@nestjs/graphql';

import { ItemUrl } from '../models/item-url.model';

@InputType()
export class AddItemUrlInput extends PickType(
  ItemUrl,
  ['url', 'isPrimary'],
  InputType
) {}
