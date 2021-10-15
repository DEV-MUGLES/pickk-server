import { IBaseId } from '@common/interfaces';

import { IItem } from '@item/items/interfaces';

import { IItemsGroup } from './items-group.interface';

export interface IItemsGroupItem extends IBaseId {
  group: IItemsGroup;
  groupId: number;

  item: IItem;
  itemId: number;
}
