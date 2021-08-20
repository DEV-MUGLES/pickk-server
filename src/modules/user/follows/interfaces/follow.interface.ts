import { IUser } from '@user/users/interfaces';

export interface IFollow {
  id: number;
  createdAt: Date;

  user: IUser;
  userId: number;

  target: IUser;
  targetId: number;
}
