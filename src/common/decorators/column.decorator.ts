import { Column, ColumnOptions } from 'typeorm';

export const FloatColumn = (options?: ColumnOptions) =>
  Column({ type: 'float', default: null, nullable: true, ...options });
