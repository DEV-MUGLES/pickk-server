import { AlimtalkMessageRequest } from 'nest-sens';

import { getPurchaseItemInfo, getTotalPayAmount } from '@templates/helpers';

import { RefundRequest } from '@order/refund-requests/models';

import { ISellerInfo } from './intefaces';

//FIXME: 이름 수정 또는 구조적 개선 필요()
// RefundRequestedTemplate을 하려하였으나 구매자에게 반품 요청 알림을 보내는것 과 중복이 되어, 이상한 이름이 탄생함
export class RefundRequestCreatedTemplate {
  static code = 'Brefund01';

  static toRequest(
    sellerInfo: ISellerInfo,
    refundRequest: RefundRequest
  ): Omit<AlimtalkMessageRequest, 'plusFriendId'> {
    const { phoneNumber, brandKor } = sellerInfo;
    return {
      templateCode: this.code,
      messages: [
        {
          to: phoneNumber,
          content: this.toContent(brandKor, refundRequest),
        },
      ],
    };
  }

  static toContent(brandKor: string, refundRequest: RefundRequest): string {
    const { order, orderItems, requestedAt, reason } = refundRequest;
    return `안녕하세요! ${brandKor} 담당자님, 환불요청이 접수되었습니다. 제품수령 후 환불승인 처리 요청드립니다.
    ▶ 주문상품번호 : ${order.merchantUid}
    ▶ 구매자 : ${order.buyer.name}
    ▶ 구매 상품 : ${getPurchaseItemInfo(
      orderItems
    )} (상품명, 색상, 사이즈, 개수)
    ▶ 환불요청일시 : ${requestedAt}
    ▶ 결제금액 : ${getTotalPayAmount(order.orderItems)}
    ▶ 환불사유 : ${reason}
    `;
  }
}
