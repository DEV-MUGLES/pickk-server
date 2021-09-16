import { IBaseId } from '@common/interfaces';

import { IItemProperty } from './item-property.interface';

export interface IItemPropertyValue extends IBaseId {
  property: IItemProperty;

  name: string;
  order: number;
}
