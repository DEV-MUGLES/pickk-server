import { ItemsExhibition } from '../models';

export type ItemsExhibitionRelationType =
  | keyof ItemsExhibition
  | 'exhibitionItems'
  | 'exhibitionItems'
  | 'exhibitionItems.item'
  | 'exhibitionItems.item.brand'
  | 'exhibitionItems.item.prices';

export const ITEMS_EXHIBITION_RELATIONS: ItemsExhibitionRelationType[] = [
  'exhibitionItems',
  'exhibitionItems.item',
  'exhibitionItems.item.brand',
  'exhibitionItems.item.prices',
];
