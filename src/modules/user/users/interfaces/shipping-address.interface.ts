import { IAddress } from '@common/interfaces';

export interface IShippingAddress extends IAddress {
  name: string;
  receiverName: string;

  phoneNumber1: string;
  phoneNumber2?: string;
}
