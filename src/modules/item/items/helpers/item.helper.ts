import { PredefinedCategoryCode } from '@item/item-categories/constants/item-category.enum';

import {
  AvailItemSizeChartColumns,
  ItemSizeChartColumnDisplayName,
  ItemSizeChartColumnName,
} from '../constants';
import { ItemOptionValue, ItemOption, ItemSizeChartMetaData } from '../models';

export const getOptionValueCombinations = (
  options: ItemOption[]
): ItemOptionValue[][] => {
  const valueCounts = options.map(({ values }) => values.length);
  const result: ItemOptionValue[][] = [];

  const recur = (now: ItemOptionValue[]) => {
    if (now.length === options.length) {
      result.push(now);
      return;
    }

    const index = now.length;
    [...Array(valueCounts[index])].forEach((_, vIndex) =>
      recur([...now, options[index].values[vIndex]])
    );
  };

  recur([]);

  return result;
};

const isPredefinedCategoryCode = (
  code: unknown
): code is PredefinedCategoryCode => {
  return (
    code !== null &&
    Object.values(PredefinedCategoryCode).includes(
      code as PredefinedCategoryCode
    )
  );
};

const getItemSizeChartColumnDisplayName = (
  majorCode: string,
  minorCode: string,
  columnName: ItemSizeChartColumnName
) => {
  const matchedColumnDisplayName = ItemSizeChartColumnDisplayName.find(
    (data) => data.columnName === columnName
  );
  if (!isPredefinedCategoryCode(minorCode)) {
    return matchedColumnDisplayName.displayNames[0].name;
  }
  return (
    matchedColumnDisplayName.displayNames.find(
      (data) => data.code === minorCode
    ) ||
    matchedColumnDisplayName.displayNames.find(
      (data) => data.code === majorCode
    ) ||
    matchedColumnDisplayName.displayNames[0]
  ).name;
};

export const getAvailItemSizeChartColumns = (
  majorCode: string,
  minorCode: string
): ItemSizeChartColumnName[] => {
  if (!isPredefinedCategoryCode(minorCode)) {
    return AvailItemSizeChartColumns[majorCode];
  }
  return (
    AvailItemSizeChartColumns[minorCode] ||
    AvailItemSizeChartColumns[majorCode] ||
    []
  );
};

export const getSizeChartMetaDatas = (majorCode: string, minorCode: string) => {
  return getAvailItemSizeChartColumns(majorCode, minorCode).map(
    (columnName) =>
      new ItemSizeChartMetaData({
        columnName,
        displayName: getItemSizeChartColumnDisplayName(
          majorCode,
          minorCode,
          columnName
        ),
      })
  );
};
