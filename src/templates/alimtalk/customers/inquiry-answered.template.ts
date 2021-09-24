import { AlimtalkMessageRequest } from 'nest-sens';

import { Inquiry } from '@item/inquiries/models';

import { partialEncrypt } from '@common/helpers';

export class InquiryAnsweredTemplate {
  static code = 'Cqna03';

  static toRequest(
    inquiry: Inquiry
  ): Omit<AlimtalkMessageRequest, 'plusFriendId'> {
    return {
      templateCode: this.code,
      messages: [
        {
          to: inquiry.contactPhoneNumber,
          content: this.toContent(inquiry),
        },
      ],
    };
  }

  static toContent(inquiry: Inquiry) {
    const {
      user: { name },
      item,
      content,
      answers,
      id,
    } = inquiry;
    const url = `https://pickk.one/my/inquiries/${id}`;
    return `안녕하세요! ${partialEncrypt(
      name,
      1
    )}님, 문의주신 내용에 답변이 등록되었습니다.
    ◼︎ 문의 내역
- 상품: ${item.name}
- 내용: ${content}

◼︎ 답변 내역
- 내용: ${answers[answers.length - 1].content}
- 링크: ${url}`;
  }
}
