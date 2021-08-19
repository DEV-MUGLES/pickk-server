import { Inject, Injectable } from '@nestjs/common';

import { IncomingWebhook, IncomingWebhookResult } from '@slack/webhook';

import { Item } from '@item/items/models';
import { ItemCreationTemplate } from '@templates/slack';
import { User } from '@user/users/models';

import { SlackChannelName } from './constants';

@Injectable()
export class SlackService {
  constructor(
    @Inject(IncomingWebhook) private readonly webhook: IncomingWebhook
  ) {}

  /**
   *  webhook사용가이드를 위한 예시용 메소드입니다. 실제 적용시에 파라미터 및 템플릿이 변경될 수 있습니다.
   */
  async sendItemCreationMessage(
    item: Item,
    user: User
  ): Promise<IncomingWebhookResult> {
    const {
      name,
      brand: { nameKor },
      originalPrice,
      sellPrice,
      createdAt,
      urls,
    } = item;
    const { nickname, email } = user;
    return await this.webhook.send({
      ...ItemCreationTemplate.toMessage({
        name,
        brandNameKor: nameKor,
        originalPrice,
        salePrice: sellPrice,
        createdAt,
        itemUrl: urls[0].url,
        user: {
          nickname,
          email,
        },
      }),
      channel: SlackChannelName.ItemManagement,
    });
  }
}
