import { IUser } from '@user/users/interfaces/user.interface';

export interface IExpectedPointEvent {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  amount: number;

  title: string;
  content: string;

  /** 검색을 위한 field로 join하지 않는다. */
  orderId: number;

  userId: number;
  user: IUser;
}
