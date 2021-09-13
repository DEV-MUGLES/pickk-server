import { IncomingWebhookSendArguments } from '@slack/webhook';
import dayjs from 'dayjs';

import { SlackChannelName } from '@providers/slack/constants';

import { Inquiry } from '@item/inquiries/models';

export class InquiryCreationTemplate {
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
      channel: SlackChannelName.ItemManagement,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*문의 등록 알림*',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*<${superUrl}|${title}>* \n${content}`,
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              style: 'primary',
              text: {
                type: 'plain_text',
                text: '주문 내역',
              },
              url: adminUrl,
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '문의 상세',
              },
              url: superUrl,
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '핔에서 보기',
              },
              url: pickkUrl,
            },
          ],
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `*<mailto:${email}|${email}(${nickname})>* at ${dayjs(
                createdAt
              )
                .format('YYYY. M. D. a H:mm:ss')
                .replace('pm', '오후')
                .replace('am', '오전')}`,
            },
          ],
        },
      ],
    };
  }
}
