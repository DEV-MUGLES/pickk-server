import { AlimtalkMessageRequest } from 'nest-sens';

import { partialEncrypt } from '@common/helpers';
import { RefundRequest } from '@order/refund-requests/models';

import { getPurchaseItemInfo } from '../../helpers';

export class RefundRequestedTemplate {
  static toRequest(
    refundRequest: RefundRequest
  ): Omit<AlimtalkMessageRequest, 'plusFriendId'> {
    const TemplateClass = refundRequest.shipment
      ? Crefund02Template
      : Crefund03Template;

    return {
      templateCode: TemplateClass.code,
      messages: [
        {
          to: refundRequest.order.buyer.phoneNumber,
          content: TemplateClass.toContent(refundRequest),
        },
      ],
    };
  }
}

class Crefund02Template {
  static code = 'crefund02';

  static toContent(refundRequest: RefundRequest) {
    const { order, orderItems, shipment } = refundRequest;

    return `${partialEncrypt(
      order.buyer.name,
      1
    )}님의 반품신청이 정상 접수되었습니다.

▶ 상품명 : ${getPurchaseItemInfo(orderItems)}
▶ 주문번호 : ${order.merchantUid}

▶ 반송 운송장 번호 : ${shipment.courier.name} ${shipment.trackCode}

상품검수가 완료되는대로 환불처리가 진행됩니다.`;
  }
}

class Crefund03Template {
  static code = 'crefund03';

  static toContent(refundRequest: RefundRequest) {
    const { order, orderItems, seller } = refundRequest;

    const { brandNameKor } = orderItems[0];
    const { returnAddress, courier } = seller;

    return `${partialEncrypt(
      order.buyer.name,
      1
    )}님의 반품신청이 정상 접수되었습니다.

▶ 상품명 : ${getPurchaseItemInfo(orderItems)}
▶ 주문번호 : ${order.merchantUid}

아래 반송지로 착불발송 요청드립니다.

▶ 택배사 : ${courier.name}
▶ 배송지 : [${returnAddress.postalCode}] ${returnAddress.baseAddress} ${
      returnAddress.detailAddress
    }
▶ 받는이 : ${brandNameKor}

▶ 반품 예약링크 : ${courier.returnReserveUrl}

상품검수가 완료되는대로 환불이 처리되오니, 빠른 반송을 요청드립니다.`;
  }
}
