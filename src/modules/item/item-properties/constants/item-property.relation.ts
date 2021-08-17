import { ItemProperty } from '../models';

export type ItemPropertyRelationType = keyof ItemProperty;

export const ITEM_PROPERTY_RELATIONS: ItemPropertyRelationType[] = [
  'values',
  'minorCategory',
];
