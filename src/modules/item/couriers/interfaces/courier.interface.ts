import { IBaseId } from '@common/interfaces';

export interface ICourier extends IBaseId {
  code: string;
  name: string;
  phoneNumber: string;
  returnReserveUrl: string;
}
