export const findModelById = <T extends { id: number }>(
  id: number,
  models: T[]
): T => {
  return models.find((model) => model.id === id);
};

export const findModelsByIds = <T extends { id: number }>(
  ids: number[],
  models: T[]
): T[] => {
  return ids.map((id) => models.find((model) => model.id === id));
};
