import { PredefinedCategoryCode } from '@item/item-categories/constants';

import { ItemSizeChartColumnName } from './item-size-chart.enum';

export const {
  OUTER,
  TOP,
  BAG,
  BELT,
  BOTTOM,
  ACC,
  WATCH,
  SUNGLASSES,
  MUFFLER,
  HAT,
} = PredefinedCategoryCode;

const {
  name,
  totalLength,
  shoulderWidth,
  chestWidth,
  sleeveLength,
  waistWidth,
  riseHeight,
  thighWidth,
  hemWidth,
  accWidth,
  accHeight,
  accDepth,
  crossStrapLength,
  watchBandDepth,
  glassWidth,
  glassBridgeLength,
  glassLegLength,
} = ItemSizeChartColumnName;

const OuterSizeChartColumns = [
  totalLength,
  shoulderWidth,
  chestWidth,
  sleeveLength,
];
const BottomSizeChartColumns = [
  totalLength,
  waistWidth,
  riseHeight,
  thighWidth,
  hemWidth,
];
const AccessorySizeChartColumns = [accWidth, accHeight, accDepth];
const BagSizeChartColumns = [...AccessorySizeChartColumns, crossStrapLength];
const BeltSizeChartColumns = [totalLength, accWidth, accHeight];
const WatchSizeChartColumns = [...AccessorySizeChartColumns, watchBandDepth];
const GlassesSizeChartColumns = [
  accWidth,
  accHeight,
  glassWidth,
  glassBridgeLength,
  glassLegLength,
];
const MufflerSizeChartColumns = [totalLength, accDepth];

export const AvailItemSizeChartColumns = {
  [OUTER]: OuterSizeChartColumns,
  [TOP]: OuterSizeChartColumns,
  [BOTTOM]: BottomSizeChartColumns,
  [ACC]: AccessorySizeChartColumns,
  [BAG]: BagSizeChartColumns,
  [BELT]: BeltSizeChartColumns,
  [WATCH]: WatchSizeChartColumns,
  [SUNGLASSES]: GlassesSizeChartColumns,
  [MUFFLER]: MufflerSizeChartColumns,
};

export const ItemSizeChartColumnDisplayName = [
  {
    columnName: name,
    displayNames: [{ name: '사이즈' }],
  },
  {
    columnName: totalLength,
    displayNames: [{ name: '총길이' }, { code: HAT, name: '챙길이' }],
  },
  {
    columnName: shoulderWidth,
    displayNames: [{ name: '어깨너비' }],
  },
  {
    columnName: chestWidth,
    displayNames: [{ name: '가슴단면' }],
  },
  {
    columnName: sleeveLength,
    displayNames: [{ name: '소매길이' }],
  },
  {
    columnName: waistWidth,
    displayNames: [{ name: '허리단면' }],
  },
  {
    columnName: riseHeight,
    displayNames: [{ name: '밑위' }],
  },
  {
    columnName: thighWidth,
    displayNames: [{ name: '허벅지단면' }],
  },
  {
    columnName: hemWidth,
    displayNames: [{ name: '밑단단면' }],
  },
  {
    columnName: crossStrapLength,
    displayNames: [{ name: '끈길이' }],
  },
  {
    columnName: watchBandDepth,
    displayNames: [{ name: '밴드폭' }],
  },
  {
    columnName: glassWidth,
    displayNames: [{ name: '안경너비' }],
  },
  {
    columnName: glassBridgeLength,
    displayNames: [{ name: '브릿지길이' }],
  },
  {
    columnName: glassLegLength,
    displayNames: [{ name: '다리길이' }],
  },
  {
    columnName: accWidth,
    displayNames: [
      { name: '너비' },
      { code: HAT, name: '머리둘레' },
      { code: WATCH, name: '케이스가로지름' },
      { code: SUNGLASSES, name: '렌즈너비' },
      { code: BELT, name: '버클가로' },
    ],
  },
  {
    columnName: accHeight,
    displayNames: [
      { name: '높이' },
      { code: HAT, name: '깊이' },
      { code: WATCH, name: '케이스세로지름' },
      { code: SUNGLASSES, name: '렌즈높이' },
      { code: BELT, name: '버클세로' },
    ],
  },
  {
    columnName: accDepth,
    displayNames: [{ name: '폭' }, { code: WATCH, name: '케이스폭' }],
  },
];
