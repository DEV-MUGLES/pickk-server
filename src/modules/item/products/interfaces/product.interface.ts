import { IItem, IItemOptionValue } from '@item/items/interfaces';

export interface IProduct {
  stock: number;

  item: IItem;
  itemOptionValues: IItemOptionValue[];
}
