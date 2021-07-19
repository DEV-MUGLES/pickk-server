import { IProduct } from '@item/products/interfaces';
import { IUser } from '@user/users/interfaces';

export interface ICartItem {
  id: number;
  /** DB index로 지정 */
  createdAt: Date;
  updatedAt: Date;

  quantity: number;

  productId: number;
  product: IProduct;
  userId: number;
  user: IUser;
}
