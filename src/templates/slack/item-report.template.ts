import { IncomingWebhookSendArguments } from '@slack/webhook';
import dayjs from 'dayjs';

import { SlackChannelName } from '@providers/slack/constants';

import { Item } from '@item/items/models';

/**
 * 예시용 slack template입니다.
 * TODO: builder pattern 고민해보기
 */
export class ItemReportTemplate {
  static create(
    item: Item,
    reason: string,
    nickname: string
  ): IncomingWebhookSendArguments {
    const { id, name, brand, originalPrice, sellPrice, urls } = item;

    return {
      channel: SlackChannelName.ItemManagement,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*🚨 상품 정보 오류 신고가 접수되었습니다.*',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*상품명* :\n[${brand.nameKor}] ${name} (id: ${id})`,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*originalPrice* :\n${originalPrice}`,
            },
            {
              type: 'mrkdwn',
              text: `*sellPrice* :\n${sellPrice}`,
            },
          ],
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*사유* :\n${reason} `,
            },
            {
              type: 'mrkdwn',
              text: `*생성자* :\n${nickname} `,
            },
          ],
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '아이템 링크',
              },
              url: urls[0].url,
              style: 'primary',
            },
          ],
        },
        {
          type: 'context',
          elements: [
            {
              type: 'plain_text',
              text: dayjs().format('YYYY. MM. DD. hh:mm:ss'),
            },
          ],
        },
      ],
    };
  }
}
