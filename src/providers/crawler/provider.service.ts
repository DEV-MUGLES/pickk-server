import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
    await this.checkIsExistUrl(url);

    const requestUrl = new URL(this.url + '/info');
    requestUrl.searchParams.append('url', url);

    const { data } = await firstValueFrom(
      this.httpService.get<ItemInfoCrawlResult>(requestUrl.href)
    );

    if (
      !data.name ||
      !data.brandKor ||
      !data.originalPrice ||
      !data.salePrice
    ) {
      throw new InternalServerErrorException(
        '크롤링된 상품 정보가 잘못됐습니다.'
      );
    }

    return data;
  }

  async crawlOption(url: string): Promise<ItemOptionCrawlResult> {
    await this.checkIsExistUrl(url);

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

  private async checkIsExistUrl(url: string) {
    try {
      await firstValueFrom(this.httpService.get(url));
    } catch (err) {
      throw new InternalServerErrorException(
        `접근이 불가능한 URL입니다. URL: ${url}`
      );
    }
  }
}
