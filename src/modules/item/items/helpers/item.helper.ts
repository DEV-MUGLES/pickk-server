import { ItemOptionValue, ItemOption } from '../models';

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
