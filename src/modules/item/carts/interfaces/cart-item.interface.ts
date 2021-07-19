import { IUser } from '@user/users/interfaces';

import { IProduct } from '../../products/interfaces/product.interface';

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
