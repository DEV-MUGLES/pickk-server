import { OrderItem } from '@order/order-items/models';

export function getTotalPayAmount(orderItems: OrderItem[]) {
  return orderItems.reduce(
    (total, orderItem) => total + orderItem.payAmount,
    0
  );
}
