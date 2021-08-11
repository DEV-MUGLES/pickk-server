export const getRandomIntBetween = (min: number, max: number): number => {
  const num = Math.random() * (max - min) + min;
  return Math.round(Math.max(min, Math.min(num, max)));
};

export const shuffleArray = <T = unknown>(arr: T[]): T[] =>
  arr.sort(() => Math.random() - 0.5);

export const getRandomEle = <T = unknown>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

export const getEnumValues = (input) =>
  Object.values(input).filter((value) => typeof value === 'string');

/** get random value of given enum. except given excludes array */
export const getRandomEnumValue = (input, excludes = []) => {
  const valuesExcept = getEnumValues(input).filter(
    (value) => excludes.indexOf(value) === -1
  );
  return getRandomEle(valuesExcept);
};

export const getRandomString = (length = 6): string => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const s4 = () =>
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
const s8 = () => s4() + s4();
const s12 = () => s8() + s4();

/** return random uuid */
export const getRandomUuid = () => {
  return [s8(), s4(), s4(), s4(), s12()].join('-');
};
