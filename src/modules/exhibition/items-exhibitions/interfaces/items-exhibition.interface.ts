import { IBaseId } from '@common/interfaces';

import { IItemsExhibitionItem } from './items-exhibition-item.interface';

export interface IItemsExhibition extends IBaseId {
  exhibitionItems: IItemsExhibitionItem[];

  title: string;
}
