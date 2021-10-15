import { IncomingWebhookSendArguments } from '@slack/webhook';

import { format2Korean } from '@common/helpers';
import { SlackChannelName } from '@providers/slack/constants';

import { Inquiry } from '@item/inquiries/models';

import { BaseSlackTemplate } from './base-slack.template';

export class InquiryCreationTemplate extends BaseSlackTemplate {
  static create(inquiry: Inquiry): IncomingWebhookSendArguments {
    const {
      title,
      content,
      id,
      user: { email, nickname },
      createdAt,
    } = inquiry;
    const adminUrl = `https://admin.pickk.one/order-items`;
    const rootUrl = `https://root.pickk.one/inquiries/${id}`;

    return {
      channel: SlackChannelName.InquiryManagement,
      blocks: this.getBlocksBuilder()
        .addText('*문의 등록 알림*')
        .addText(`*<${rootUrl}|${title}>* \n${content}`)
        .addButtons([
          { text: '주문 내역', style: 'primary', url: adminUrl },
          { text: '문의 상세', url: rootUrl },
        ])
        .addContext(
          `*<mailto:${email}|${email}(${nickname})>* at ${format2Korean(
            createdAt
          )}`
        )
        .build(),
    };
  }
}
