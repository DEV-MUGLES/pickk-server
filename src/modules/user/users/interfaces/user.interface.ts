import { ShippingAddress } from '../models/shipping-address.model';

/**
 * User variable type declaration.
 *
 * @interface
 */
export interface IUser {
  code?: string;
  email: string;
  name: string | null;
  weight?: number;
  height?: number;
  shippingAddresses: ShippingAddress[];
}
