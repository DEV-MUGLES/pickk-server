import { IItem, IItemOptionValue } from '@item/items/interfaces';

export interface IProduct {
  stock: number;
  /** product생성 시 itemOptionValue들의 priceVariant값의 합이다. 주문상품의 fianlPrice 계산 시에 사용하기 위해 저장한다.*/
  priceVariant: number;
  isDeleted: boolean;

  item: IItem;
  itemId: number;

  itemOptionValues: IItemOptionValue[];
}
