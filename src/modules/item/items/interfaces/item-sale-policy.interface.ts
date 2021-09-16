import { IBaseId } from '@common/interfaces';

export interface IItemSalePolicy extends IBaseId {
  isUsingStock: boolean;
  quantityLimit: number;
  isUsingQuantityLimit: boolean;
}
