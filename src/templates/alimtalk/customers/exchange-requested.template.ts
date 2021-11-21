import { AlimtalkMessageRequest } from '@nestjs-packages/ncp-sens';

import { partialEncrypt } from '@common/helpers';
import { getExchangeItemInfo } from '@templates/helpers';

import { ExchangeRequest } from '@order/exchange-requests/models';

export class ExchangeRequestedCustomerTemplate {
  static toRequest(
    exchangeRequest: ExchangeRequest
  ): Omit<AlimtalkMessageRequest, 'plusFriendId'> {
    const TemplateClass = exchangeRequest.pickShipment
      ? Cexch04Template
      : Cexch03Template;

    return {
      templateCode: TemplateClass.code,
      messages: [
        {
          to: exchangeRequest.orderItem.order.buyer.phoneNumber,
          content: TemplateClass.toContent(exchangeRequest),
        },
      ],
    };
  }
}

class Cexch04Template {
  static code = 'cexch04';

  static toContent(exchangeRequest: ExchangeRequest) {
    const { orderItem, pickShipment } = exchangeRequest;
    const {
      order: { buyer },
    } = orderItem;

    return `${partialEncrypt(buyer.name, 1)}님의 교환신청이 정상 접수되었습니다.

▶ 상품명 : ${getExchangeItemInfo(exchangeRequest)} 
▶ 주문상품번호 : ${orderItem.merchantUid}

▶ 반송 운송장 번호 : ${pickShipment.courier.name} ${pickShipment.trackCode}

상품검수가 완료되는대로 신규상품이 출고됩니다.
    `;
  }
}

class Cexch03Template {
  static code = 'cexch03';

  static toContent(exchangeRequest: ExchangeRequest) {
    const { orderItem, seller } = exchangeRequest;

    const {
      brandNameKor,
      order: { buyer },
    } = orderItem;
    const { returnAddress, courier } = seller;

    return `${partialEncrypt(buyer.name, 1)}님의 교환신청이 정상 접수되었습니다.

▶ 상품명 : ${getExchangeItemInfo(exchangeRequest)}
▶ 주문상품번호 : ${orderItem.merchantUid}

아래 반송지로 착불발송 요청드립니다.

▶ 택배사 : ${courier.name}
▶ 배송지 : [${returnAddress.postalCode}] ${returnAddress.baseAddress} ${
      returnAddress.detailAddress
    }
▶ 받는이 : ${brandNameKor}

▶ 반품 예약링크 : ${courier.returnReserveUrl}

상품검수가 완료되는대로 신규상품이 출고되오니, 빠른 반송을 요청드립니다.
    `;
  }
}
