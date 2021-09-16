import { IBaseId } from '@common/interfaces';

import { IItemOption } from './item-option.interface';

export interface IItemOptionValue extends IBaseId {
  itemOption: IItemOption;
  itemOptionId: number;

  name: string;
  priceVariant: number;
  order: number;
}
