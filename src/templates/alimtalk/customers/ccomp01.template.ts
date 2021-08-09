import { addCommas } from '@common/helpers';

import { Order } from '@order/orders/models';

import { getPurchaseItemInfo } from '../../helpers';

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
