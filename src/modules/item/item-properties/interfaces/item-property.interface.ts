import { IItemCategory } from '@item/item-categories/interfaces';

import { IItemPropertyValue } from './item-property-value.interface';

export interface IItemProperty {
  name: string;

  minorCategory: IItemCategory;
  minorCategoryId: number;

  values: IItemPropertyValue[];
}
