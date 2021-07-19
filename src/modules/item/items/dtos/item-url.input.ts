import { InputType, PickType } from '@nestjs/graphql';

import { ItemUrl } from '../models';

@InputType()
export class AddItemUrlInput extends PickType(
  ItemUrl,
  ['url', 'isPrimary'],
  InputType
) {}
