import { ItemPriceUnit } from '../constants';

import { IItem } from './item.interface';

export interface IItemPrice {
  originalPrice: number;
  sellPrice: number;

  /** 핔 부담 할인까지 모두 고려된 최종 결제 금액입니다. */
  finalPrice: number;

  /** 핔 부담 할인 금액. amount와 rate중 1개만 존재합니다. */
  pickkDiscountAmount?: number;
  /** 핔 부담 할인율. amount와 rate중 1개만 존재합니다. */
  pickkDiscountRate?: number;

  /** 활성화 여부. 1개의 ItemPrice만 활성화될 수 있다.
   * @default isFirst ? true : false */
  isActive: boolean;
  /** 크롤링 업데이트 여부.
   * @default isFirst ? true : false */
  isCrawlUpdating: boolean;
  /** Base 가격인가 여부. 1개의 ItemPrice만 Base로 설정될 수 있다.
   * - Base 가격은 삭제할 수 없다.
   * @default isFirst ? true : false */
  isBase: boolean;

  /** 입력된 시점이 됐을 때 이 가격이 활성화된다. */
  startAt?: Date | null;

  /** 입력된 시점이 됐을 때 이 가격이 비활성화되고 Base 가격이 활성화된다. */
  endAt?: Date | null;

  /** 노출용 가격. 외화일 때만 사용됩니다. */
  displayPrice?: number | null;
  /** 노출되는 가격 단위. @default KRW */
  unit?: ItemPriceUnit;

  item: IItem;
}
