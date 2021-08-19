import { IncomingWebhookSendArguments } from '@slack/webhook';
import dayjs from 'dayjs';

type ItemCreationMessageParam = {
  name: string;
  brandNameKor: string;
  originalPrice: number;
  salePrice: number;
  itemUrl: string;
  createdAt: Date;
  user: {
    nickname: string;
    email: string;
  };
};

/**
 * 예시용 slack template입니다.
 * TODO: builder pattern 고민해보기
 */
export class ItemCreationTemplate {
  static toMessage(
    itemCreationMessageParam: ItemCreationMessageParam
  ): IncomingWebhookSendArguments {
    const {
      name,
      brandNameKor,
      originalPrice,
      salePrice,
      itemUrl,
      createdAt,
      user: { nickname, email },
    } = itemCreationMessageParam;

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
              text: `*brand* :\n${brandNameKor}`,
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
              url: itemUrl,
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
