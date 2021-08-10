import { Args, ArgsOptions, Int } from '@nestjs/graphql';

export const IntArgs = (property: string, options?: ArgsOptions) =>
  Args(property, { type: () => Int, ...options });
