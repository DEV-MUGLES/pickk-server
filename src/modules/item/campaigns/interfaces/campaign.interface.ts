import { IItem } from '@item/items/interfaces/item.interface';

export interface ICampaign {
  /** 적용될 정산률 */
  rate: number;

  items: IItem[];

  startAt: Date;
  endAt: Date;
}
