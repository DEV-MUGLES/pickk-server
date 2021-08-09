import { addCommas } from '@common/helpers';

import { OrderItem } from '@order/order-items/models';
import { Order } from '@order/orders/models';

export const createCcomp01Template = (order: Order) => {
  const { buyer, merchantUid, totalPayAmount, receiver, orderItems } = order;

  const purchaseItemInfo = getPurchaseItemInfo(orderItems);

  return `${buyer.name}님의 주문이 완료되었습니다.

▶ 주문번호 : ${merchantUid}
▶ 상품명 : ${purchaseItemInfo}
▶ 결제금액 : ${addCommas(totalPayAmount)}원
▶ 배송지 : [${receiver.postalCode}] ${receiver.baseAddress} ${
    receiver.detailAddress
  }`;
};

const getPurchaseItemInfo = (orderItems: OrderItem[]) => {
  const { brandNameKor, itemName, productVariantName, quantity } =
    orderItems[0];

  return (
    `[${brandNameKor}] ${itemName} (${productVariantName}) ${quantity}개` +
    (orderItems.length > 1 ? `외 ${orderItems.length - 1}건` : '')
  );
};
