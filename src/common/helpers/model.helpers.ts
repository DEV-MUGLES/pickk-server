export const findModelsByIds = <T extends { id: number }>(
  ids: number[],
  models: T[]
): T[] => {
  return ids.map((id) => models.find((model) => model.id === id));
};
