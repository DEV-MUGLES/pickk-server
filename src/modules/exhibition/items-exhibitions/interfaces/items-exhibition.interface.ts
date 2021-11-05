import { IBaseId } from '@common/interfaces';

import { IVideo } from '@content/videos/interfaces';

import { IItemsExhibitionItem } from './items-exhibition-item.interface';

export interface IItemsExhibition extends IBaseId {
  exhibitionItems: IItemsExhibitionItem[];

  video: IVideo;
  videoId: number;

  title: string;
  description: string;

  imageUrl: string;
  imageTop: number;
  imageRight: number;
  backgroundColor: string;

  isVisible: boolean;
  order: number;
}
