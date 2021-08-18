import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Service dealing with bull config based operations.
 *
 * @class
 */
@Injectable()
export class SentryConfigService {
  constructor(private configService: ConfigService) {}

  get environment(): string {
    return this.configService.get<string>('sentry.environment');
  }

  get dsn(): string {
    return this.configService.get<string>('sentry.dsn');
  }
}
