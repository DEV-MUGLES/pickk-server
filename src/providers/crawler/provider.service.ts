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
import { requestHeaderObjects } from './constants';

@Injectable()
export class CrawlerProviderService {
  private baseUrl: string;

  constructor(
    private readonly crawlerConfigService: CrawlerConfigService,
    private readonly httpService: HttpService
  ) {
    this.baseUrl = this.crawlerConfigService.url;
  }

  async crawlInfo(url: string): Promise<ItemInfoCrawlResult> {
    // await this.checkUrlExisting(url);

    const requestUrl = new URL(`${this.baseUrl}/info`);
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
    // await this.checkUrlExisting(url);

    const {
      data: { values: options, optionPriceVariants },
    } = await firstValueFrom(
      this.httpService.get<CrawlItemOptionResponseDto>(
        `${this.baseUrl}/option?url=${encodeURI(url)}`
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

  private async checkUrlExisting(url: string) {
    const headerObject = requestHeaderObjects[this.getHostName(url)] || {};
    try {
      await firstValueFrom(
        this.httpService.get(url, {
          timeout: 10000,
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
            ...headerObject,
          },
        })
      );
    } catch (err) {
      throw new InternalServerErrorException(
        `접근이 불가능한 URL입니다. URL: ${url}`
      );
    }
  }

  private getHostName(url: string): string {
    const { hostname } = new URL(url);
    if (hostname.includes('topten10mall.com')) {
      return 'topten10mall.com';
    }
    if (url.includes('espionage.co.kr/m')) {
      return 'espionage.co.kr/m';
    }
    if (url.includes('mamagari.com/m')) {
      return 'mamagari.com/m';
    }
    if (url.includes('ocokorea.com/shopMobile')) {
      return 'ocokorea.com/shopMobile';
    }
    if (url.includes('brand.naver.com/ralphlauren')) {
      return 'brand.naver.com/ralphlauren';
    }
    if (url.includes('.ssg.com')) {
      return 'ssg.com';
    }
    return hostname.replace('www.', '');
  }
}
