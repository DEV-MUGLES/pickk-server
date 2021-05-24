import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Service dealing with bull config based operations.
 *
 * @class
 */
@Injectable()
export class BullConfigService {
  constructor(private configService: ConfigService) {}

  get redisHost(): string {
    return this.configService.get<string>('bull.redisHost');
  }
  get redisPort(): string {
    return this.configService.get<string>('bull.redisPort');
  }
}
