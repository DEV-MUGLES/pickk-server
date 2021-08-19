import { Inject, Injectable } from '@nestjs/common';
import {
  IncomingWebhook,
  IncomingWebhookResult,
  IncomingWebhookSendArguments,
} from '@slack/webhook';

@Injectable()
export class SlackWebhookService {
  constructor(
    @Inject(IncomingWebhook) private readonly webhook: IncomingWebhook
  ) {}

  async sendItemCrawlResult(
    message: string | IncomingWebhookSendArguments
  ): Promise<IncomingWebhookResult> {
    return await this.webhook.send(message);
  }
}
