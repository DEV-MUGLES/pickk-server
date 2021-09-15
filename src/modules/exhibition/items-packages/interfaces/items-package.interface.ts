import { IItemsPackageItem } from './items-package-item.interface';

export interface IItemsPackage {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  code: string;

  packageItems: IItemsPackageItem[];
}
