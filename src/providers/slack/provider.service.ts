import { Inject, Injectable } from '@nestjs/common';
import { IncomingWebhook, IncomingWebhookResult } from '@slack/webhook';

import {
  ItemInfoCrawlFailTemplate,
  ItemInfoCrawlSuccessTemplate,
  ItemReportTemplate,
} from '@templates/slack';

import { Item } from '@item/items/models';

@Injectable()
export class SlackService {
  constructor(
    @Inject(IncomingWebhook) private readonly webhook: IncomingWebhook
  ) {}

  async sendItemInfoCrawlSuccess(
    item: Item,
    nickname: string
  ): Promise<IncomingWebhookResult> {
    return await this.webhook.send(
      ItemInfoCrawlSuccessTemplate.create(item, nickname)
    );
  }

  async sendItemInfoCrawlFail(
    url: string,
    nickname: string
  ): Promise<IncomingWebhookResult> {
    return await this.webhook.send(
      ItemInfoCrawlFailTemplate.create(url, nickname)
    );
  }

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
