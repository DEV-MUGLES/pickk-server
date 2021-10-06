import { AlimtalkMessageRequest } from 'nest-sens';

import { partialEncrypt } from '@common/helpers';

import { ExchangeRequest } from '@order/exchange-requests/models';

export class ExchangeItemReshipedTemplate {
  static code = 'Cexchang01';

  static toRequest(
    exchangeRequest: ExchangeRequest
  ): Omit<AlimtalkMessageRequest, 'plusFriendId'> {
    return {
      templateCode: this.code,
      messages: [
        {
          to: exchangeRequest.orderItem.order.buyer.phoneNumber,
          content: this.toContent(exchangeRequest),
        },
      ],
    };
  }

  static toContent(exchangeRequest: ExchangeRequest): string {
    const {
      orderItem,
      itemName,
      productVariantName,
      reShipment,
      orderItemMerchantUid,
      quantity,
    } = exchangeRequest;
    const {
      brandNameKor,
      order: { buyer, receiver },
    } = orderItem;
    return `안녕하세요! ${partialEncrypt(
      buyer.name,
      1
    )}님, 판매자에 의해 교환품 검수가 완료되어 요청주신 제품이 발송되었습니다.
    ▶ 교환 아이템 : ${`[${brandNameKor}] ${itemName} (${productVariantName}) ${quantity}개`} 
    ▶ 주문상품번호 : ${orderItemMerchantUid}
    ▶ 운송장번호 : ${reShipment.courier.name} / ${reShipment.trackCode}
    ▶ 배송지 : ${receiver.baseAddress + ' ' + receiver.detailAddress ?? ''}
    ▶ 구매가격 : ${orderItem.payAmount}
    `;
  }
}
