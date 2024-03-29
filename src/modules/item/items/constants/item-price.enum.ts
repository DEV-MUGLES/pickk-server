import { registerEnumType } from '@nestjs/graphql';

/** 값 자체의 형태 때문에 예외적으로 UPPER_SNAKE_CASE를 사용한다. */
export enum ItemPriceUnit {
  KRW = 'KRW',
  USD = 'USD',
  JPY = 'JPY',
  CNY = 'CNY',
  EUR = 'EUR',
  GBP = 'GBP',
  AUD = 'AUD',
  CAD = 'CAD',
}

registerEnumType(ItemPriceUnit, {
  name: 'ItemPriceUnit',
  description:
    '아이템의 가격 단위입니다. null인 경우 원화로 취급되며, 값을 가질 경우 적절한 displayPrice에 적절한 환율을 곱한 값으로 salePrice를 설정합니다.',
});
