import { AlimtalkMessageRequest } from 'nest-sens';

import { getPurchaseItemInfo } from '@templates/helpers';

import { Inquiry } from '@item/inquiries/models';

export class InquiryCreatedTemplate {
  static code = 'bqna03';

  static toRequest(
    inquiry: Inquiry
  ): Omit<AlimtalkMessageRequest, 'plusFriendId'> {
    const {
      seller: { csNotiPhoneNumber },
    } = inquiry;

    return {
      templateCode: this.code,
      messages: [
        {
          to: csNotiPhoneNumber,
          content: this.toContent(inquiry),
        },
      ],
    };
  }

  static toContent(inquiry: Inquiry): string {
    const {
      user,
      content,
      orderItem,
      item,
      seller: { brand },
      id,
    } = inquiry;
    const itemInfo = inquiry.orderItem
      ? getPurchaseItemInfo(orderItem)
      : item.name;
    const adminUrl = `https://admin.pickk.one/inquiries/${id}`;
    return `안녕하세요! ${brand.nameKor} 담당자님, 아래 제품에 대한 고객님의 문의가 접수되었습니다. 핔 어드민 서비스를 통해 문의에 답변을 남겨주세요.
▶ 문의자 : ${user.nickname}
▶ 문의상품 : ${itemInfo}
▶ 문의내용 : ${content}
핔 어드민 URL : ${adminUrl}
    `;
  }
}
