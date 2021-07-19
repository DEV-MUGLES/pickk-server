import { ItemNoticeType } from '../constants';

export interface IItemNotice {
  type: ItemNoticeType;
  message: string;
  startAt?: Date;
  endAt?: Date;
}
