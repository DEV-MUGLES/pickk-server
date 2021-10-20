import { IBaseId } from '@common/interfaces';

export interface IItemSizeChart extends IBaseId {
  labels: string[];
  sizes: IItemSize[];
  recommendations?: IItemSizeRecommendation[];
}

export interface IItemSize {
  name: string;
  values: string[];
}

export interface IItemSizeRecommendation {
  height: number;
  weight: number;
  sizeName: string;
}
