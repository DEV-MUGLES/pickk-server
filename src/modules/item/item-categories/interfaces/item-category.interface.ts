import { IBaseId } from '@common/interfaces';

export interface IItemCategory extends IBaseId {
  parent: IItemCategory;
  children: IItemCategory[];

  name: string;
  code: string;

  // for migration
  oldItemMajorTypeId: number;
  oldItemMinorTypeId: number;
}
