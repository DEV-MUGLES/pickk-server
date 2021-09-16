import { IBaseId } from '@common/interfaces';

import { IItem } from './item.interface';

export interface IItemUrl extends IBaseId {
  item: IItem;

  url: string;

  isPrimary: boolean;
  isAvailable: boolean;
}
