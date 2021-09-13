import { Type } from 'class-transformer';

import { Item } from '@item/items/models';

export class SendItemCreationSuccessSlackMessageMto {
  @Type(() => Item)
  item: Item;
  nickname: string;
}
