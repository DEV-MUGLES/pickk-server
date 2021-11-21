import { AlimtalkMessageRequest } from '@nestjs-packages/ncp-sens';

import { partialEncrypt } from '@common/helpers';
import { getExchangeItemInfo } from '@templates/helpers';

import { ExchangeRequest } from '@order/exchange-requests/models';

export class ExchangeCanceledCustomerTemplate {
  static toRequest(
    exchangeRequest: ExchangeRequest
  ): Omit<AlimtalkMessageRequest, 'plusFriendId'> {
    const TemplateClass =
      exchangeRequest.shippingFee > 0 ? Cexchcn02Template : Cexchcn01Template;

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

class Cexchcn01Template {
  static code = 'cexchcn01';

  static toContent(exchangeRequest: ExchangeRequest) {
    const { orderItem, cancelReason } = exchangeRequest;
    const {
      order: { buyer },
    } = orderItem;

    return `안녕하세요 ${partialEncrypt(buyer.name, 1)}님
아래의 교환요청이 판매자의 사유로 취소되었습니다. 이용에 불편을 드려 죄송합니다.

▶ 상품명 : ${getExchangeItemInfo(exchangeRequest)}
▶ 주문번호 : ${orderItem.merchantUid}
▶ 취소사유 : ${cancelReason}
    `;
  }
}

class Cexchcn02Template {
  static code = 'cexchcn02';

  static toContent(exchangeRequest: ExchangeRequest) {
    const { orderItem, cancelReason, shippingFee } = exchangeRequest;

    const {
      order: { buyer },
    } = orderItem;

    return `안녕하세요 ${partialEncrypt(buyer.name, 1)}님
아래의 교환요청이 판매자의 사유로 취소되었습니다. 이용에 불편을 드려 죄송합니다.

▶ 상품명 : ${getExchangeItemInfo(exchangeRequest)}
▶ 주문번호 : ${orderItem.merchantUid}
▶ 취소사유 : ${cancelReason}

교환요청시 결제하셨던 금액은 환불될 예정입니다.
▶ 환불금액 : ${shippingFee}

※ 환불은 카드사 및 결제 수단에 따라 영업일 기준 최대 7일 소요될 수 있습니다.
    `;
  }
}
