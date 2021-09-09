import { AlimtalkMessageRequest } from '@pickk/sens';
import dayjs from 'dayjs';

import { Order } from '@order/orders/models';

import { getPurchaseItemInfo } from '@templates/helpers';

export class VbankNotiTemplate {
  static code = 'Cvbank02';

  static toRequest(order: Order): Omit<AlimtalkMessageRequest, 'plusFriendId'> {
    return {
      templateCode: this.code,
      messages: [
        {
          to: order.buyer.phoneNumber,
          content: this.toContent(order),
        },
      ],
    };
  }

  static toContent(order: Order) {
    const {
      merchantUid,
      buyer,
      vbankInfo: { ownerName, due, bankCodeDisplayName, number: bankNum },
      totalPayAmount,
      orderItems,
      createdAt,
      receiver: { baseAddress, detailAddress },
    } = order;
    return `안녕하세요! ${
      buyer.name
    }님, 가상계좌로 입금해주시면 주문이 완료됩니다.
        [가상계좌 입금정보]
        ▶ 입금계좌 : ${bankCodeDisplayName} ${bankNum}
        ▶ 예금주 : ${ownerName}
        ▶ 입금액 : ${totalPayAmount}
        ▶ 입금기한: ${dayjs(due).format('YYYY년 MM월 DD일 HH:mm')}까지
        [상품정보]
        ▶ 구매 상품 : ${getPurchaseItemInfo(orderItems)}
        ▶ 주문번호 : ${merchantUid}
        ▶ 주문일시 : ${dayjs(createdAt).format('YYYY년 MM월 DD일 HH:mm')}
        ▶ 배송지 : ${baseAddress} ${detailAddress}`;
  }
}
