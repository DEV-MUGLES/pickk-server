import { IBaseId } from '@common/interfaces';

import { IDigest } from '@content/digests/interfaces';
import { IProduct } from '@item/products/interfaces';
import { IUser } from '@user/users/interfaces';

export interface ICartItem extends IBaseId {
  product: IProduct;
  productId: number;
  user: IUser;
  userId: number;

  recommendDigest: IDigest;
  recommendDigestId: number;

  quantity: number;
}
