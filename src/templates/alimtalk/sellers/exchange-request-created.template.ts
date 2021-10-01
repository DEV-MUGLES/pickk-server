import { AlimtalkMessageRequest } from 'nest-sens';

import { getPurchaseItemInfo } from '@templates/helpers';

import { ExchangeRequest } from '@order/exchange-requests/models';

import { ISellerInfo } from './intefaces';

// FIXME: 이름 수정 또는 구조적 개선 필요()
// ExchangeRequestedTemplate을 하려하였으나 구매자에게 교환 요청 알림을 보내는것 과 중복이 되어, 이상한 이름이 탄생함
export class ExchangeRequestedCreatedTemplate {
  static code = 'Bexchang01';

  static toRequest(
    sellerInfo: ISellerInfo,
    exchangeRequest: ExchangeRequest
  ): Omit<AlimtalkMessageRequest, 'plusFriendId'> {
    const { phoneNumber, brandKor } = sellerInfo;
    return {
      templateCode: this.code,
      messages: [
        {
          to: phoneNumber,
          content: this.toContent(brandKor, exchangeRequest),
        },
      ],
    };
  }

  static toContent(brandKor: string, exchangeRequest: ExchangeRequest): string {
    const { requestedAt, reason, orderItem, itemName } = exchangeRequest;
    return `안녕하세요! ${brandKor} 담당자님, 교환요청이 접수되었습니다. 제품이 도착하여 검수단계를 거쳐 교환승인 처리 후 교환요청제품 발송 요청드립니다.
    ▶ 주문상품번호 : ${orderItem.merchantUid}
    ▶ 구매자 : ${orderItem.order.buyer.name}
    ▶ 구매 상품 : ${getPurchaseItemInfo(orderItem)} (상품명, 색상, 사이즈, 개수)
    ▶ 교환요청 상품 : ${itemName}
    ▶ 교환요청일시 : ${requestedAt}
    ▶ 교환사유 : ${reason}
    `;
  }
}
