import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Service dealing with mysql config based operations.
 *
 * @class
 */
@Injectable()
export class SpiderConfigService {
  constructor(private configService: ConfigService) {}

  get url(): string {
    return this.configService.get<string>('spider.url');
  }
}
