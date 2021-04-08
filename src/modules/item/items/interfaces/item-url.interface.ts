import { IItem } from './item.interface';

export interface IItemUrl {
  url: string;
  isPrimary: boolean;
  isAvailable: boolean;
  item: IItem;
}
