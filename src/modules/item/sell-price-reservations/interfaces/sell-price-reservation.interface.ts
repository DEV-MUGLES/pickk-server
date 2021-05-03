import { IItem } from '../../items/interfaces/item.interface';

export interface ISellPriceReservation {
  isActive: boolean;
  destSellPrice: number;
  isRollbackByCrawl: boolean;
  rollbackSellPrice?: number;
  startAt: Date;
  endAt: Date;

  item: IItem;
}
