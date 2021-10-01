import { AlimtalkMessageRequest } from 'nest-sens';

import { format2Korean, partialEncrypt } from '@common/helpers';
import { getPurchaseItemInfo } from '@templates/helpers';

import { ExchangeRequest } from '@order/exchange-requests/models';

export class ExchangeRequestedSellerTemplate {
  static code = 'Bexchang03';

  static toRequest(
    exchangeRequest: ExchangeRequest
  ): Omit<AlimtalkMessageRequest, 'plusFriendId'> {
    const {
      seller: { phoneNumber },
    } = exchangeRequest;
    return {
      templateCode: this.code,
      messages: [
        {
          to: phoneNumber,
          content: this.toContent(exchangeRequest),
        },
      ],
    };
  }

  static toContent(exchangeRequest: ExchangeRequest): string {
    const {
      requestedAt,
      reason,
      orderItem,
      itemName,
      productVariantName,
      seller: { brand },
    } = exchangeRequest;
    return `안녕하세요! ${
      brand.nameKor
    } 담당자님, 교환요청이 접수되었습니다. 제품이 도착하여 검수단계를 거쳐 교환승인 처리 후 교환요청제품 발송 요청드립니다.
▶ 주문상품번호 : ${orderItem.merchantUid}
▶ 구매자 : ${partialEncrypt(orderItem.order.buyer.name, 1)}
▶ 구매 상품 : ${getPurchaseItemInfo(orderItem)}
▶ 교환요청 상품 : ${itemName}(${productVariantName})
▶ 교환요청일시 : ${format2Korean(requestedAt)}
▶ 교환사유 : ${reason}
    `;
  }
}
