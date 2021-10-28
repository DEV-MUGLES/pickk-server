import { IBaseId } from '@common/interfaces';

import { IItem } from '@item/items/interfaces';

export interface ICampaign extends IBaseId {
  items: IItem[];

  title: string;
  /** 적용될 정산률 */
  rate: number;

  startAt: Date;
  endAt: Date;
}
