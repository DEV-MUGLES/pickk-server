import { Column } from 'typeorm';

export const FloatColumn = () =>
  Column({ type: 'float', unsigned: true, default: null });
