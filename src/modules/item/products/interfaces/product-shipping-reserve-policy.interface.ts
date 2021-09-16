import { IBaseId } from '@common/interfaces';

export interface IProductShippingReservePolicy extends IBaseId {
  estimatedShippingBegginDate: Date;
  stock: number;
}
