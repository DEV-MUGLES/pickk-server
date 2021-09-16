import { IBaseId } from '@common/interfaces';

import { ItemPriceUnit } from '../constants';

import { IItem } from './item.interface';

export interface IItemPrice extends IBaseId {
  item: IItem;
  itemId: number;

  originalPrice: number;
  sellPrice: number;

  /** 핔 부담 할인까지 모두 고려된 최종 결제 금액입니다. */
  finalPrice: number;

  /** 핔 부담 할인 금액. amount와 rate중 1개만 존재합니다. */
  pickkDiscountAmount?: number;
  /** 핔 부담 할인율. amount와 rate중 1개만 존재합니다. */
  pickkDiscountRate?: number;

  isActive: boolean;
  isCrawlUpdating: boolean;
  isBase: boolean;

  /** 입력된 시점이 됐을 때 이 가격이 활성화된다. */
  startAt?: Date | null;
  /** 입력된 시점이 됐을 때 이 가격이 비활성화되고 Base 가격이 활성화된다. */
  endAt?: Date | null;

  /** 노출용 가격. 외화일 때만 사용됩니다. */
  displayPrice?: number | null;
  /** 노출되는 가격 단위. @default KRW */
  unit?: ItemPriceUnit;
}
