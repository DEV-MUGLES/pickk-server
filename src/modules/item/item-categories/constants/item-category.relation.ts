import { ItemCategory } from '../models';

export const ITEM_CATEGORY_RELATIONS: Array<keyof ItemCategory> = [
  'children',
  'parent',
];
