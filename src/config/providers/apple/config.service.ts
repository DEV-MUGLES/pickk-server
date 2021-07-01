import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Service dealing with bull config based operations.
 *
 * @class
 */
@Injectable()
export class AppleConfigService {
  constructor(private configService: ConfigService) {}

  get appBundleId(): string {
    return this.configService.get<string>('apple.appBundleId');
  }
  get webBundleId(): string {
    return this.configService.get<string>('apple.webBundleId');
  }
  get teamId(): string {
    return this.configService.get<string>('apple.teamId');
  }
  get keyId(): string {
    return this.configService.get<string>('apple.keyId');
  }
  get secret(): string {
    return this.configService.get<string>('apple.secret');
  }
}
