import { IBaseId } from '@common/interfaces';

import { IItemsPackageItem } from './items-package-item.interface';

export interface IItemsPackage extends IBaseId {
  packageItems: IItemsPackageItem[];

  code: string;
  title: string;
}
