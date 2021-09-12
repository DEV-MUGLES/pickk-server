import { Inject, Injectable } from '@nestjs/common';
import { IncomingWebhook, IncomingWebhookResult } from '@slack/webhook';

import { ItemReportTemplate } from '@templates/slack';

import { Item } from '@item/items/models';

@Injectable()
export class SlackService {
  constructor(
    @Inject(IncomingWebhook) private readonly webhook: IncomingWebhook
  ) {}

  async sendItemReport(
    item: Item,
    reason: string,
    nickname: string
  ): Promise<IncomingWebhookResult> {
    return await this.webhook.send(
      ItemReportTemplate.create(item, reason, nickname)
    );
  }
}
