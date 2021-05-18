import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator';

export const IS_REGEX_STRING = 'isRegexString';
const PATTERN = /^\/.+\/(?:(?:([gimsuy])(?!.*\1))+)?$/;

export function isRegexString(value: unknown): boolean {
  return typeof value === 'string' && PATTERN.test(value);
}

/**
 * Check if the string is a regex
 * (start with /, end with /, optionally have flag).
 * If given value is not a string, then it returns false.
 */
export function IsRegexString(
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_REGEX_STRING,
      validator: {
        validate: (value): boolean => isRegexString(value),
        defaultMessage: buildMessage(
          (eachPrefix) => eachPrefix + '$property must be a regex string',
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
