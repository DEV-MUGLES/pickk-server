import axios from 'axios';
import * as cheerio from 'cheerio';

import { isEqualSet, splitRegexString } from '@common/helpers';
import { allSettled, isFulfilled, FulfillResponse } from '@common/utils';

import { ISellerCrawlInfo } from '../interfaces';

export class SellerSpider {
  public origin: string;
  public crawlInfo: ISellerCrawlInfo;
  private itemUrls: string[] = [];

  constructor(attributes?: Partial<SellerSpider>) {
    this.origin = attributes.origin;
    this.crawlInfo = attributes.crawlInfo;
  }
  /**
   * seller의 itemUrls(seller가 소유한 brand의 모든 아이템 리스트)를 수집합니다.
   * itemUrls는 중복이 제거된 채로 반환됩니다.
   * @returns itemUrls(seller가 소유한 brand의 모든 아이템 리스트)
   */
  async collectUrls(): Promise<string[]> {
    const urlDatas = await allSettled(
      this.crawlInfo.startUrls.map(
        (startUrl) =>
          new Promise(async (resolve, reject) => {
            try {
              resolve(await this.getUrlsFromPage(startUrl));
            } catch (err) {
              reject(err);
            }
          })
      )
    );

    this.itemUrls = [].concat(
      ...urlDatas
        .filter((data) => isFulfilled(data))
        .map((data) => (data as FulfillResponse).value)
    );
    return this.removeDuplicatedUrls(this.itemUrls);
  }

  /**
   * 어떤 페이지에 대해서 itemUrls를 select해 반환합니다. 다음 페이지가 존재한다면 붙여서 같이 반환합니다.
   * @param pageUrl scrap 대상 url을 찾을 page의 주소입니다.
   * @param prevUrls 전 pagination에서 얻어온 url들입니다. 중복 대조를 위해 사용됩니다.
   * @returns 찾은 url을 배열로 반환합니다.
   */
  async getUrlsFromPage(
    pageUrl: string,
    prevUrls: string[] = []
  ): Promise<string[]> {
    if (!pageUrl) {
      return [];
    }
    const { pagination, itemsSelector } = this.crawlInfo;
    const { data } = await axios.get(pageUrl);
    if (!data) {
      return [];
    }
    const $ = cheerio.load(data);

    const urls = [];
    $(itemsSelector).each((_i, ele) => {
      urls.push(this.origin + $(ele).attr('href'));
    });

    // 크롤링된 url들이 모두 전 페이지와 중복된다면 바로 escape합니다.
    if (isEqualSet(new Set(prevUrls), new Set(urls))) {
      return [];
    }

    if (urls.length === 0 || !pagination) {
      return urls;
    }

    const nextPageUrl = this.getNextPage(pageUrl);
    return urls.concat(await this.getUrlsFromPage(nextPageUrl, urls));
  }

  getNextPage(pageUrl: string): string {
    const { pagination, pageParam } = this.crawlInfo;
    if (!pagination || !pageParam) {
      return null;
    }

    const url = new URL(pageUrl);
    const searchParams = new URLSearchParams(url.search);

    if (!searchParams.get(pageParam)) {
      return null;
    }

    searchParams.set(
      pageParam,
      (Number(searchParams.get(pageParam)) + 1).toString()
    );
    return `${url.origin}${url.pathname}?${searchParams.toString()}`;
  }

  removeDuplicatedUrls(itemUrls: string[]): string[] {
    if (!itemUrls) {
      return [];
    }

    const codeRegex = new RegExp(...splitRegexString(this.crawlInfo.codeRegex));
    const itemCodes = itemUrls.map((url) => url.match(codeRegex)[1]);

    return itemUrls.filter(
      (_, index) => itemCodes.indexOf(itemCodes[index]) === index
    );
  }
}
