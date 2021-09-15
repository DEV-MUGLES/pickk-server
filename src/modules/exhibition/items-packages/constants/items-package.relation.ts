import { ItemsPackage } from '../models';

export type ItemsPackageRelationType =
  | keyof ItemsPackage
  | 'packageItems'
  | 'packageItems'
  | 'packageItems.item'
  | 'packageItems.item.brand'
  | 'packageItems.item.prices';

export const ITEMS_PACKAGE_RELATIONS: ItemsPackageRelationType[] = [
  'packageItems',
  'packageItems.item',
  'packageItems.item.brand',
  'packageItems.item.prices',
];
