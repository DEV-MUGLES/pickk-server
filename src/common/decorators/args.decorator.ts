import { Args, Int } from '@nestjs/graphql';

export const IntArgs = (property: string) =>
  Args(property, { type: () => Int });
