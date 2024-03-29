import { AlimtalkMessageRequest } from '@pickk/sens';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { Order } from '@order/orders/models';

import { Timezone } from '@common/constants';
import { addCommas, partialEncrypt } from '@common/helpers';
import { getPurchaseItemInfo } from '@templates/helpers';

dayjs.extend(utc);
dayjs.extend(timezone);

export class VbankNotiTemplate {
  static code = 'Cvbank02';

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
    const {
      merchantUid,
      buyer,
      vbankReceipt: { ownerName, due, bankDisplayName, number: bankNum },
      totalPayAmount,
      orderItems,
      createdAt,
      receiver: { baseAddress, detailAddress },
    } = order;
    return `안녕하세요! ${partialEncrypt(
      buyer.name,
      1
    )}님, 가상계좌로 입금해주시면 주문이 완료됩니다.
[가상계좌 입금정보]
▶ 입금계좌 : ${bankDisplayName} ${bankNum}
▶ 예금주 : ${ownerName}
▶ 입금액 : ${addCommas(totalPayAmount)}원
▶ 입금기한: ${dayjs
      .tz(due, Timezone.Seoul)
      .format('YYYY년 MM월 DD일 HH:mm')}까지
[상품정보]
▶ 구매 상품 : ${getPurchaseItemInfo(orderItems)}
▶ 주문번호 : ${merchantUid}
▶ 주문일시 : ${dayjs
      .tz(createdAt, Timezone.Seoul)
      .format('YYYY년 MM월 DD일 HH:mm')}
▶ 배송지 : ${baseAddress} ${detailAddress}`;
  }
}
