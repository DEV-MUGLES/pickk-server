import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import { CrawlerConfigService } from '@config/providers/crawler';

import {
  CrawlItemOptionResponseDto,
  OptionData,
  ItemInfoCrawlResult,
  ItemOptionCrawlResult,
  OptionValueData,
} from './dtos';

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

  async crawlOption(url: string): Promise<ItemOptionCrawlResult> {
    const {
      data: { values: options, optionPriceVariants },
    } = await firstValueFrom(
      this.httpService.get<CrawlItemOptionResponseDto>(
        `${this.url}/option?url=${encodeURI(url)}`
      )
    );

    const optionDatas: OptionData[] = Object.keys(options).map((optionName) => {
      const optionValueDatas: OptionValueData[] = options[optionName].map(
        (valueName) => ({
          name: valueName,
          priceVariant: 0,
        })
      );

      return {
        name: optionName,
        values: optionValueDatas,
      };
    });

    optionPriceVariants.forEach(
      ({ option: [optionIndex, valueIndex], price }) => {
        optionDatas[optionIndex].values[valueIndex].priceVariant = price;
      }
    );

    return { options: optionDatas };
  }
}
