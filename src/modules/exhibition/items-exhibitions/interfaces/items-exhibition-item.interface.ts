import { IBaseId } from '@common/interfaces';

import { IItem } from '@item/items/interfaces';

import { IItemsExhibition } from './items-exhibition.interface';

export interface IItemsExhibitionItem extends IBaseId {
  exhibition: IItemsExhibition;
  exhibitionId: number;

  item: IItem;
  itemId: number;
}
