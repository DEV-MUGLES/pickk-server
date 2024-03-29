import { AlimtalkMessageRequest } from '@nestjs-packages/ncp-sens';

import { Order } from '@order/orders/models';

import { addCommas, partialEncrypt } from '@common/helpers';
import { getPurchaseItemInfo, getTotalPayAmount } from '@templates/helpers';

export class CancelOrderApprovedTemplate {
  static code = 'ccancel03';

  static toRequest(
    canceledOrder: Order
  ): Omit<AlimtalkMessageRequest, 'plusFriendId'> {
    const {
      buyer: { phoneNumber },
    } = canceledOrder;

    return {
      templateCode: this.code,
      messages: [
        {
          to: phoneNumber,
          content: this.toContent(canceledOrder),
        },
      ],
    };
  }

  static toContent(canceledOrder: Order) {
    const {
      merchantUid,
      orderItems,
      receiver: { baseAddress, detailAddress },
      buyer: { name },
    } = canceledOrder;

    return `안녕하세요! ${partialEncrypt(
      name,
      1
    )}님, 구매취소요청이 승인되었습니다. 영업일 기준 5일 내외에 구매금액은 환불될 예정입니다. 
    ▶ 구매 아이템 : ${getPurchaseItemInfo(orderItems)}
    ▶ 주문번호 : ${merchantUid}
    ▶ 배송지 : ${`${baseAddress} ${detailAddress}`} 
    ▶ 취소금액 : ${addCommas(getTotalPayAmount(orderItems))}원`;
  }
}
