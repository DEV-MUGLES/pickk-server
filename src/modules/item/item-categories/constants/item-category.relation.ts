import { ItemCategory } from '../../item-categories/models/item-category.model';

export const ITEM_CATEGORY_RELATIONS: Array<keyof ItemCategory> = [
  'children',
  'parent',
];
