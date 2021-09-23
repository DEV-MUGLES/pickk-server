import { AlimtalkMessageRequest } from 'nest-sens';

import { Order } from '@order/orders/models';

import { addCommas, partialEncrypt } from '@common/helpers';

import { getPurchaseItemInfo } from '../../helpers';

export class CompleteOrderTemplate {
  static code = 'ccomp01';

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
    const { buyer, merchantUid, totalPayAmount, receiver, orderItems } = order;
    return `${partialEncrypt(buyer.name, 1)}님의 주문이 완료되었습니다.
  
  ▶ 주문번호 : ${merchantUid}
  ▶ 상품명 : ${getPurchaseItemInfo(orderItems)}
  ▶ 결제금액 : ${addCommas(totalPayAmount)}원
  ▶ 배송지 : [${receiver.postalCode}] ${receiver.baseAddress} ${
      receiver.detailAddress
    }`;
  }
}
