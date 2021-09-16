import { IBaseId } from '@common/interfaces';

import { IItem } from '@item/items/interfaces';
import { IOrderItem } from '@order/order-items/interfaces';
import { IUser } from '@user/users/interfaces';

import { InquiryType } from '../constants';

import { IInquiryAnswer } from './inquiry-answer.interface';

export interface IInquiry extends IBaseId {
  user: IUser;
  userId: number;
  item: IItem;
  itemId: number;
  orderItem: IOrderItem;
  orderItemMerchantUid: string;

  answers: IInquiryAnswer[];

  type: InquiryType;
  title: string;
  content: string;
  contactPhoneNumber: string;
  isSecret: boolean;

  isAnswered: boolean;
}
