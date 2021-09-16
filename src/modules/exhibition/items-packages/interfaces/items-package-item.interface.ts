import { IBaseId } from '@common/interfaces';

import { IItem } from '@item/items/interfaces';

import { IItemsPackage } from './items-package.interface';

export interface IItemsPackageItem extends IBaseId {
  package: IItemsPackage;
  packageId: number;

  item: IItem;
  itemId: number;
}
