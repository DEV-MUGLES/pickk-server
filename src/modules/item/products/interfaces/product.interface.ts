import { IItem } from '../../items/interfaces/item.interface';
import { ItemOptionValue } from '../../items/models/item-option-value.model';

export interface IProduct {
  stock: number;

  item: IItem;
  itemOptionValues: ItemOptionValue[];
}
