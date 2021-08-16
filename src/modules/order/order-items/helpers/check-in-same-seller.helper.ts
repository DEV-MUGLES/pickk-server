import { OrderItem } from '../models';

export const checkInSameSeller = (orderItems: OrderItem[]): boolean => {
  // 다른 Seller에 대한 예외 처리가 목적인 함수이므로, 아예 들어오지 않았을 때는 허용해준다.
  // 아예 들어오지 않은 case는 다른 모듈에서 catch해야할 상황일 것 같음.
  if (orderItems.length === 0) {
    return true;
  }

  return orderItems.every((oi) => oi.sellerId === orderItems[0].sellerId);
};
