import { ItemSizeChartColumnName } from '../constants';

import { IItem } from './item.interface';

export interface IItemSizeChart {
  name: string;
  //상의,아우터,하의,악세사리등 총 길이와 관련된 정보
  totalLength?: number;
  //상의,아우터의 사이즈 정보
  shoulderWidth?: number;
  chestWidth?: number;
  sleeveLength?: number;
  waistWidth?: number;
  //하의의 사이즈 정보
  riseHeight?: number;
  thighWidth?: number;
  hemWidth?: number;
  //악세사리(가방,시계,지갑,벨트,안경렌즈)의 사이즈 정보
  accWidth?: number;
  accHeight?: number;
  accDepth?: number;
  //가방,시계,안경의 사이즈 정보
  crossStrapLength?: number;
  watchBandDepth?: number;
  glassWidth?: number;
  glassBridgeLength?: number;
  glassLegLength?: number;

  item?: IItem;
  itemId: number;
}

export interface IItemSizeChartMetaData {
  columnName: ItemSizeChartColumnName;
  displayName: string;
}
