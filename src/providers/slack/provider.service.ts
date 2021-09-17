import { Inject, Injectable } from '@nestjs/common';
import { IncomingWebhook, IncomingWebhookResult } from '@slack/webhook';

import {
  DigestCreationTemplate,
  InquiryCreationTemplate,
  ItemCreationFailTemplate,
  ItemCreationSuccessTemplate,
  ItemReportTemplate,
} from '@templates/slack';

import { Item } from '@item/items/models';
import { Inquiry } from '@item/inquiries/models';
import { Digest } from '@content/digests/models';

@Injectable()
export class SlackService {
  constructor(
    @Inject(IncomingWebhook) private readonly webhook: IncomingWebhook
  ) {}

  async sendItemCreationSuccess(
    item: Item,
    nickname: string
  ): Promise<IncomingWebhookResult> {
    return await this.webhook.send(
      ItemCreationSuccessTemplate.create(item, nickname)
    );
  }

  async sendItemCreationFail(
    url: string,
    nickname: string
  ): Promise<IncomingWebhookResult> {
    return await this.webhook.send(
      ItemCreationFailTemplate.create(url, nickname)
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

  async sendInquiryCreation(inquiry: Inquiry): Promise<IncomingWebhookResult> {
    return await this.webhook.send(InquiryCreationTemplate.create(inquiry));
  }

  async sendDigestCreation(digest: Digest): Promise<IncomingWebhookResult> {
    return await this.webhook.send(DigestCreationTemplate.create(digest));
  }
}
