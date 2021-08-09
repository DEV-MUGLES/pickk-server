import { RefundRequest } from '@order/refund-requests/models';
import { getPurchaseItemInfo } from '@templates/helpers';

export const createCrefund03Template = (refundRequest: RefundRequest) => {
  const { order, orderItems, seller } = refundRequest;

  const { brand, returnAddress, courier } = seller;

  return `#{userName}님의 반품신청이 정상 접수되었습니다.

▶ 상품명 : ${getPurchaseItemInfo(orderItems)}
▶ 주문번호 : ${order.merchantUid}

아래 반송지로 착불발송 요청드립니다.

▶ 택배사 : ${courier.name}
▶ 배송지 : [${returnAddress.postalCode}] ${returnAddress.baseAddress} ${
    returnAddress.detailAddress
  }
▶ 받는이 : ${brand.nameKor}

▶ 반품 예약링크 : #{courierReturnReserveUrl}

상품검수가 완료되는대로 환불이 처리되오니, 빠른 반송을 요청드립니다.`;
};
