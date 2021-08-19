import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Service dealing with bull config based operations.
 *
 * @class
 */
@Injectable()
export class SlackWebhookConfigService {
  constructor(private configService: ConfigService) {}

  get url(): string {
    return this.configService.get<string>('slackWebhook.url');
  }
}
