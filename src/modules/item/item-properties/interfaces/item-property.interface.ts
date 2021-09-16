import { IBaseId } from '@common/interfaces';

import { IItemCategory } from '@item/item-categories/interfaces';

import { IItemPropertyValue } from './item-property-value.interface';

export interface IItemProperty extends IBaseId {
  minorCategory: IItemCategory;
  minorCategoryId: number;

  values: IItemPropertyValue[];

  name: string;
}
