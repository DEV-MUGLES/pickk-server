import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import { CrawlerConfigService } from '@config/providers/crawler';

import { ItemInfoCrawlResult } from './dtos';

@Injectable()
export class CrawlerProviderService {
  url: string;

  constructor(
    private readonly crawlerConfigService: CrawlerConfigService,
    private readonly httpService: HttpService
  ) {
    this.url = this.crawlerConfigService.url;
  }

  async crawlInfo(url: string): Promise<ItemInfoCrawlResult> {
    const { data } = await firstValueFrom(
      this.httpService.get<ItemInfoCrawlResult>(
        `${this.url}/info?url=${encodeURI(url)}`
      )
    );
    return data;
  }
}
