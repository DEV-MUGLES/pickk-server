import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator';

export const IS_BUSINESS_CODE = 'isBusinessCode';
const PATTERN = /\d{3}-\d{2}-\d{5}/;

export function isBusinessCode(value: unknown): boolean {
  return typeof value === 'string' && PATTERN.test(value);
}

/**
 * Check if the string is a businessCode
 * (format is '###-##-#####').
 * If given value is not a string, then it returns false.
 */
export function IsBusinessCode(
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_BUSINESS_CODE,
      validator: {
        validate: (value): boolean => isBusinessCode(value),
        defaultMessage: buildMessage(
          (eachPrefix) =>
            eachPrefix + "$property must be a business code ('###-##-#####')",
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
