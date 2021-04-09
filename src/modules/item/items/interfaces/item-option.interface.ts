import { IItemOptionValue } from './item-option-value.interface';

export interface IItemOption {
  name: string;
  order: number;

  values: IItemOptionValue[];
}
