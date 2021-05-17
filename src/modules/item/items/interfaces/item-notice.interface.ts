import { ItemNoticeType } from '../constants/item-notice.enum';

export interface IItemNotice {
  type: ItemNoticeType;
  message: string;
  startAt?: Date;
  endAt?: Date;
}
