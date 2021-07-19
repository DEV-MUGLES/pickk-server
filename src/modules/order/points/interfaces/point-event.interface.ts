import { IUser } from '@user/users/interfaces';

import { PointType } from '../constants/points.enum';

export interface IPointEvent {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  type: PointType;
  amount: number;
  /** 적립/차감 이후 잔고 */
  resultBalance: number;

  title: string;
  content: string;

  /** 검색을 위한 field로 join하지 않는다. */
  orderId?: number;
  orderItemId?: number;

  userId: number;
  user: IUser;
}
