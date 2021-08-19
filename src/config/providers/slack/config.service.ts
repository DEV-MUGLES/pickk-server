import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Service dealing with bull config based operations.
 *
 * @class
 */
@Injectable()
export class SlackConfigService {
  constructor(private configService: ConfigService) {}

  get webhookUrl(): string {
    return this.configService.get<string>('slack.webhookUrl');
  }
}
