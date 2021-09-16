import { IBaseId } from '@common/interfaces';

import { IItem } from './item.interface';
import { IItemOptionValue } from './item-option-value.interface';

export interface IItemOption extends IBaseId {
  item: IItem;
  itemId: number;

  values: IItemOptionValue[];

  name: string;
  order: number;
}
