import { IUser } from '@user/users/interfaces';

import { LikeOwnerType } from '../constants';

export interface ILike {
  id: number;
  createdAt: Date;

  user: IUser;
  userId: number;

  ownerType: LikeOwnerType;
  ownerId: number;
}
