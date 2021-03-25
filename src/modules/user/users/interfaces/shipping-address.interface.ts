import { IAddress } from '@src/common/interfaces/address.interface';

export interface IShippingAddress extends IAddress {
  name: string;
  receiverName: string;

  phoneNumber1: string;
  phoneNumber2?: string;
}
