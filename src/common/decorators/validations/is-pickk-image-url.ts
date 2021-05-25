import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator';

export const IS_PICKK_IMAGE_URL = 'isPickkImageUrl';
const PATTERN = new RegExp(
  `^${process.env.AWS_CLOUDFRONT_URL}.+\.(png|jpg|jpeg|bmp|gif|svg)$`,
  'i'
);

export function isPickkImageUrl(value: unknown): value is string {
  return typeof value === 'string' && PATTERN.test(value);
}

/**
 * Check if the string is a regex
 * (start with /, end with /, optionally have flag).
 * If given value is not a string, then it returns false.
 */
export function IsPickkImageUrl(
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_PICKK_IMAGE_URL,
      validator: {
        validate: (value): boolean => isPickkImageUrl(value),
        defaultMessage: buildMessage(
          (eachPrefix) =>
            eachPrefix +
            '$property must be a Pickk Image Url (외부 링크는 허용되지 않습니다.)',
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
