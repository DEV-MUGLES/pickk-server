import { IAddress } from '@common/interfaces';

export interface IOrderReceiver extends IAddress {
  name: string;
  email: string;
  phoneNumber: string;
}
