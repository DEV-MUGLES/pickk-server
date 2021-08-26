export const getUpdateScript = (body: Record<string, unknown>) =>
  Object.entries(body).reduce((result, [key, value]) => {
    return `${result} ctx._source.${key}='${value}';`;
  }, '');
