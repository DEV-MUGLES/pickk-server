import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ElasticsearchConfigService {
  constructor(private configService: ConfigService) {}

  get node(): string {
    return this.configService.get<string>('elasticsearch.node');
  }

  get port(): number {
    return this.configService.get<number>('elasticsearch.port');
  }

  get username(): string {
    return this.configService.get<string>('elasticsearch.username');
  }

  get password(): string {
    return this.configService.get<string>('elasticsearch.password');
  }
}
