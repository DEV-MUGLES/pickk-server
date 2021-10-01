import { AlimtalkMessageRequest } from 'nest-sens';

import { getPurchaseItemInfo } from '@templates/helpers';

import { Inquiry } from '@item/inquiries/models';

export class InquiryCreatedTemplate {
  static toRequest(
    inquiry: Inquiry
  ): Omit<AlimtalkMessageRequest, 'plusFriendId'> {
    const {
      seller: { phoneNumber },
    } = inquiry;
    const TemplateClass = inquiry.orderItem ? Bqna01Template : Bqna02Template;
    return {
      templateCode: TemplateClass.code,
      messages: [
        {
          to: phoneNumber,
          content: TemplateClass.toContent(inquiry),
        },
      ],
    };
  }
}

class Bqna01Template {
  static code = 'Bqna01';

  static toContent(inquiry: Inquiry): string {
    const {
      user,
      content,
      orderItem,
      seller: { brand },
    } = inquiry;
    return `안녕하세요! ${
      brand.nameKor
    } 담당자님, 아래 제품에 대한 고객님의 문의가 접수되었습니다. 핔 어드민 서비스를 통해 문의에 답변을 남겨주세요.
▶ 문의자 : ${user.name}
▶ 문의상품 : ${getPurchaseItemInfo(orderItem)}
▶ 문의내용 : ${content}
핔 어드민 URL : https://admin.pickk.one/dashboard/
    `;
  }
}

class Bqna02Template {
  static code = 'Bqna02';

  static toContent(inquiry: Inquiry): string {
    const {
      user,
      item,
      content,
      seller: { brand },
    } = inquiry;
    return `안녕하세요! ${brand.nameKor} 담당자님, 아래 제품에 대한 고객님의 문의가 접수되었습니다. 문의에 답변을 남겨주세요.
▶ 문의자 : ${user.name}
▶ 문의상품 : ${item.name}
▶ 문의내용 : ${content}
URL: https://pickk.one/item/${item.id}
        `;
  }
}
