import { IncomingWebhookSendArguments } from '@slack/webhook';
import dayjs from 'dayjs';

export type ItemInfo = {
  name: string;
  brand: string;
  originalPrice: number;
  salePrice: number;
  itemUrl: string;
  adminUrl: string;
  createdAt: Date;
};

export type UserInfo = { nickname: string; email: string };

export class ItemCreationTemplate {
  static toMessage(
    itemInfo: ItemInfo,
    userInfo: UserInfo
  ): IncomingWebhookSendArguments {
    const {
      name,
      brand,
      originalPrice,
      salePrice,
      adminUrl,
      itemUrl,
      createdAt,
    } = itemInfo;
    const { nickname, email } = userInfo;

    return {
      blocks: [
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*name* :\n${name}`,
            },
            {
              type: 'mrkdwn',
              text: `*brand* :\n${brand}`,
            },
          ],
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*original_price* :\n${originalPrice}`,
            },
            {
              type: 'mrkdwn',
              text: `*original_price* :\n${salePrice}`,
            },
          ],
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*url* :\n${itemUrl}`,
            },
            {
              type: 'mrkdwn',
              text: `*생성자* :\n${nickname} (${email})`,
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
                text: '아이템 보러가기',
              },
              url: adminUrl,
              style: 'primary',
            },
          ],
        },
        {
          type: 'context',
          elements: [
            {
              type: 'plain_text',
              text: dayjs(createdAt).format('YYYY. MM. DD. hh:mm:ss'),
            },
          ],
        },
      ],
    };
  }
}
