import { InputType, PickType } from '@nestjs/graphql';

import { ItemProfileUrl } from '../models/item-profile-url.model';

@InputType()
export class AddItemProfileUrlInput extends PickType(
  ItemProfileUrl,
  ['url', 'isPrimary'],
  InputType
) {}
