import { Inject, Injectable } from '@nestjs/common';
import { IncomingWebhook, IncomingWebhookResult } from '@slack/webhook';

import { ItemCreationTemplate, ItemInfo, UserInfo } from '@templates/slack';
import { SlackChannelName } from './constants';

@Injectable()
export class SlackWebhookService {
  constructor(
    @Inject(IncomingWebhook) private readonly webhook: IncomingWebhook
  ) {}

  async sendItemCreationMessage(
    itemInfo: ItemInfo,
    userInfo: UserInfo
  ): Promise<IncomingWebhookResult> {
    return await this.webhook.send({
      ...ItemCreationTemplate.toMessage(itemInfo, userInfo),
      channel: SlackChannelName.ProductManagement,
    });
  }
}
