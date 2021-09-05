import { IItem } from '@item/items/interfaces';

import { IItemsExhibition } from './items-exhibition.interface';

export interface IItemsExhibitionItem {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  exhibition: IItemsExhibition;
  exhibitionId: number;

  item: IItem;
  itemId: number;
}
