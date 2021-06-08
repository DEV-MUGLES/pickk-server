import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Service dealing with bull config based operations.
 *
 * @class
 */
@Injectable()
export class SensConfigService {
  constructor(private configService: ConfigService) {}

  get ncloudAccessKey(): string {
    return this.configService.get<string>('sens.ncloudAccessKey');
  }
  get ncloudSecretKey(): string {
    return this.configService.get<string>('sens.ncloudSecretKey');
  }
  get ncloudSmsServiceId(): string {
    return this.configService.get<string>('sens.ncloudSmsServiceId');
  }
  get ncloudSmsSecretKey(): string {
    return this.configService.get<string>('sens.ncloudSmsSecretKey');
  }
  get ncloudSmsCallingNumber(): string {
    return this.configService.get<string>('sens.ncloudSmsCallingNumber');
  }
  get ncloudAlimtalkServiceId(): string {
    return this.configService.get<string>('sens.ncloudAlimtalkServiceId');
  }
  get plusFriendId(): string {
    return this.configService.get<string>('sens.plusFriendId');
  }
}
