import { IBaseId } from '@common/interfaces';

import { IItemsExhibitionItem } from './items-exhibition-item.interface';

export interface IItemsExhibition extends IBaseId {
  exhibitionItems: IItemsExhibitionItem[];

  title: string;
  description: string;

  imageUrl: string;
  imageTop: number;
  imageRight: number;
  backgroundColor: string;

  isVisible: boolean;
  order: number;
}
