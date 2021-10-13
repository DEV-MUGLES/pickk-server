import { AlimtalkMessageRequest } from 'nest-sens';

import { addCommas, format2Korean, partialEncrypt } from '@common/helpers';
import { getPurchaseItemInfo, getTotalPayAmount } from '@templates/helpers';

import { RefundRequest } from '@order/refund-requests/models';

export class RefundRequestedSellerTemplate {
  static code = 'Brefund01';

  static toRequest(
    refundRequest: RefundRequest
  ): Omit<AlimtalkMessageRequest, 'plusFriendId'> {
    const {
      seller: { orderNotiPhoneNumber },
    } = refundRequest;
    return {
      templateCode: this.code,
      messages: [
        {
          to: orderNotiPhoneNumber,
          content: this.toContent(refundRequest),
        },
      ],
    };
  }

  static toContent(refundRequest: RefundRequest): string {
    const {
      order,
      orderItems,
      requestedAt,
      reason,
      seller: { brand },
    } = refundRequest;
    return `안녕하세요! ${
      brand.nameKor
    } 담당자님, 환불요청이 접수되었습니다. 제품수령 후 환불승인 처리 요청드립니다.
▶ 주문번호 : ${order.merchantUid}
▶ 구매자 : ${partialEncrypt(order.buyer.name, 1)}
▶ 구매 상품 : ${getPurchaseItemInfo(orderItems)}
▶ 환불요청일시 : ${format2Korean(requestedAt)}
▶ 결제금액 : ${addCommas(getTotalPayAmount(orderItems))}원
▶ 환불사유 : ${reason}
    `;
  }
}
