import { IItemsExhibitionItem } from './items-exhibition-item.interface';

export interface IItemsExhibition {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  title: string;

  exhibitionItems: IItemsExhibitionItem[];
}
