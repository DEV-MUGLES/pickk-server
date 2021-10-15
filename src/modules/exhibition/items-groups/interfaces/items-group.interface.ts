import { IBaseId } from '@common/interfaces';

import { IItemsGroupItem } from './items-group-item.interface';

export interface IItemsGroup extends IBaseId {
  groupItems: IItemsGroupItem[];

  name: string;
}
