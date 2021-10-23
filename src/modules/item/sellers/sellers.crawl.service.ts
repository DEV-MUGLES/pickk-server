import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import * as cheerio from 'cheerio';

import {
  isEqualSet,
  splitRegexString,
  allSettled,
  FulfillResponse,
  isFulfilled,
  merge,
} from '@common/helpers';

import { ScrapSellerItemUrlsDto } from './dtos';
import { ISellerCrawlStrategy } from './interfaces';

@Injectable()
export class SellersCrawlService {
  constructor(private readonly httpService: HttpService) {}

  async scrapItemUrls(scrapSellerItemUrlsDto: ScrapSellerItemUrlsDto) {
    const { crawlStrategy } = scrapSellerItemUrlsDto;
    const { startPathNamesJoin, baseUrl, codeRegex } = crawlStrategy;

    const startUrls = startPathNamesJoin
      .split('<>')
      .map((pathName) => baseUrl + pathName);
    const urlDatas = await allSettled(
      startUrls.map(
        (startUrl) =>
          new Promise(async (resolve, reject) => {
            try {
              resolve(await this.getUrlsFromPage(crawlStrategy, startUrl));
            } catch (err) {
              reject(err);
            }
          })
      )
    );

    const itemUrls = [].concat(
      ...urlDatas
        .filter((data) => isFulfilled(data))
        .map((data) => (data as FulfillResponse).value)
    );
    return this.removeDuplicatedUrls(itemUrls, codeRegex);
  }

  async getUrlsFromPage(
    crawlStrategy: ISellerCrawlStrategy,
    pageUrl: string,
    prevUrls: string[] = []
  ): Promise<string[]> {
    if (!pageUrl) {
      return [];
    }
    const { pagination, itemsSelector, pageParam } = crawlStrategy;
    const { data } = await firstValueFrom(this.httpService.get(pageUrl));
    if (!data) {
      return [];
    }
    const $ = cheerio.load(data);

    const urls = [];
    $(itemsSelector).each((_i, ele) => {
      urls.push(merge(pageUrl, $(ele).attr('href')));
    });

    // 크롤링된 url들이 모두 전 페이지와 중복된다면 바로 escape합니다.
    if (isEqualSet(new Set(prevUrls), new Set(urls))) {
      return [];
    }

    if (urls.length === 0 || !pagination) {
      return urls;
    }

    const nextPageUrl = this.getNextPage(pageUrl, pagination, pageParam);
    return urls.concat(
      await this.getUrlsFromPage(crawlStrategy, nextPageUrl, urls)
    );
  }

  getNextPage(pageUrl: string, pagination: boolean, pageParam: string): string {
    if (!pagination || !pageParam) {
      return null;
    }

    const url = new URL(pageUrl);
    const searchParams = new URLSearchParams(url.search);

    searchParams.set(
      pageParam,
      (Number(searchParams.get(pageParam) ?? 1) + 1).toString()
    );
    return `${url.origin}${url.pathname}?${searchParams.toString()}`;
  }

  removeDuplicatedUrls(itemUrls: string[], codeRegex: string): string[] {
    if (!itemUrls) {
      return [];
    }

    const newCodeRegex = new RegExp(...splitRegexString(codeRegex));
    const itemCodes = itemUrls.map((url) => url.match(newCodeRegex)[1]);

    return itemUrls.filter(
      (_, index) => itemCodes.indexOf(itemCodes[index]) === index
    );
  }
}
