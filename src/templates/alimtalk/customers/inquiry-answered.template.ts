import { AlimtalkMessageRequest } from 'nest-sens';

import { Inquiry } from '@item/inquiries/models';

export class InquryAnsweredTemplate {
  static code = 'Cqna03';

  static toRequest(
    inquiry: Inquiry
  ): Omit<AlimtalkMessageRequest, 'plusFriendId'> {
    return {
      templateCode: this.code,
      messages: [
        {
          to: inquiry.user.phoneNumber,
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
    const lastAnswer = answers[answers.length - 1];
    const url = `https://pickk.one/inquiry/${id}`;
    return `안녕하세요! ${name}님, 문의주신 내용에 답변이 등록되었습니다.
◼︎ 문의 내역
- 상품: ${item.name}
- 내용: ${content}

◼︎ 답변 내역
- 내용: ${lastAnswer.content}
- 링크: ${url}`;
  }
}
