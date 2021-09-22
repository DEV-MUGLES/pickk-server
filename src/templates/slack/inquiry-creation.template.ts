import { IncomingWebhookSendArguments } from '@slack/webhook';
import dayjs from 'dayjs';

import { SlackChannelName } from '@providers/slack/constants';

import { Inquiry } from '@item/inquiries/models';

import { BaseSlackTemplate } from './base-slack.template';

export class InquiryCreationTemplate extends BaseSlackTemplate {
  static create(inquiry: Inquiry): IncomingWebhookSendArguments {
    const {
      title,
      content,
      id,
      itemId,
      userId,
      user: { email, nickname },
      createdAt,
    } = inquiry;
    const adminUrl = `https://api.pickk.xyz/admin/orders/orderitem/?user__id=${userId}`;
    const superUrl = `https://super.admin.pickk.one/manage/question/${id}`;
    const pickkUrl = `https://pickk.one/item/${itemId}/questions/`;

    return {
      channel: SlackChannelName.INQUIRY_MANAGEMENT,
      blocks: this.getBlocksBuilder()
        .addText('*문의 등록 알림*')
        .addText(`*<${superUrl}|${title}>* \n${content}`)
        .addButtons([
          { text: '주문 내역', style: 'primary', url: adminUrl },
          { text: '문의 상세', url: superUrl },
          { text: '핔에서 보기', url: pickkUrl },
        ])
        .addContext(
          `*<mailto:${email}|${email}(${nickname})>* at ${dayjs(createdAt)
            .format('YYYY. M. D. a H:mm:ss')
            .replace('pm', '오후')
            .replace('am', '오전')}`
        )
        .build(),
    };
  }
}
