import { IBaseId } from '@common/interfaces';

export interface IItemSizeChart extends IBaseId {
  serializedLabels: string;
  serializedSizes: string;
  serializedRecommendations?: string;
}
