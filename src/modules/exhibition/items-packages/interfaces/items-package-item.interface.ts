import { IItem } from '@item/items/interfaces';

import { IItemsPackage } from './items-package.interface';

export interface IItemsPackageItem {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  package: IItemsPackage;
  packageId: number;

  item: IItem;
  itemId: number;
}
