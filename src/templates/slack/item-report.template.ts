import { IncomingWebhookSendArguments } from '@slack/webhook';

import { format2Korean } from '@common/helpers';
import { SlackChannelName } from '@providers/slack/constants';

import { Item } from '@item/items/models';

import { BaseSlackTemplate } from './base-slack.template';

export class ItemReportTemplate extends BaseSlackTemplate {
  static create(
    item: Item,
    reason: string,
    nickname: string
  ): IncomingWebhookSendArguments {
    const { id, name, brand, originalPrice, sellPrice, url } = item;
    return {
      channel: SlackChannelName.ItemManagement,
      blocks: this.getBlocksBuilder()
        .addText('*🚨 상품 정보 오류 신고가 접수되었습니다.*')
        .addText(`*상품명* :\n[${brand.nameKor}] ${name} (id: ${id})`)
        .addSection([
          `*originalPrice* :\n${originalPrice}`,
          `*sellPrice* :\n${sellPrice}`,
        ])
        .addSection([`*사유* :\n${reason} `, `*생성자* :\n${nickname} `])
        .addButtons([{ text: '아이템 링크', url, style: 'primary' }])
        .addContext(format2Korean(new Date()))
        .build(),
    };
  }
}
