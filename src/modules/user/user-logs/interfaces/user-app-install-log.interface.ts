import { IUser } from '@user/users/interfaces';

export interface IUserAppInstallLog {
  user: IUser;
  userId: number;

  createdAt: Date;
}
