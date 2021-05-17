import { registerEnumType } from '@nestjs/graphql';

export enum ItemNoticeType {
  /** 배송지연 */
  DeliveryDelay,
  /** 주문제작 */
  CustomOrder,
  /** 해외배송 */
  OverseaDelivery,
  /** 예약배송 */
  PreorderDelivery,
  /** 일반안내 */
  General,
}

registerEnumType(ItemNoticeType, {
  name: 'ItemNoticeType',
  description: '아이템 안내 분류입니다. 기본값은 General입니다.',
});
