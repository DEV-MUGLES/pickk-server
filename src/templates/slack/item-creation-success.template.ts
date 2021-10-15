import { IncomingWebhookSendArguments } from '@slack/webhook';

import { format2Korean } from '@common/helpers';
import { SlackChannelName } from '@providers/slack/constants';

import { Item } from '@item/items/models';

import { BaseSlackTemplate } from './base-slack.template';

export class ItemCreationSuccessTemplate extends BaseSlackTemplate {
  static create(item: Item, nickname: string): IncomingWebhookSendArguments {
    const { id, name, brand, originalPrice, sellPrice, url } = item;

    return {
      channel: SlackChannelName.ItemManagement,
      blocks: this.getBlocksBuilder()
        .addText('*👕 새로운 상품이 생성되었습니다.*')
        .addText(`*상품명* :\n[${brand.nameKor}] ${name} (id: ${id})`)
        .addSection([
          `*originalPrice* :\n${originalPrice}`,
          `*sellPrice* :\n${sellPrice}`,
        ])
        .addText(`*생성자* :\n${nickname} `)
        .addButtons([
          {
            text: 'URL',
            url,
            style: 'primary',
          },
        ])
        .addContext(format2Korean(new Date()))
        .build(),
    };
  }
}
