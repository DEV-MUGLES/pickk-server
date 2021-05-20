import { ItemOptionValue } from '../models/item-option-value.model';
import { ItemOption } from '../models/item-option.model';

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
