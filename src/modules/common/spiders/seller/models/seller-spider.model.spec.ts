import * as faker from 'faker';

import { SellerSpider } from '.';

const CRAWL_INFO_DATA = {
  itemsSelector: faker.lorem.text(),
  pagination: faker.datatype.boolean(),
  pageParam: faker.lorem.text(),
  codeRegex: '/sumin/',
  startUrls: [faker.internet.url(), faker.internet.url(), faker.internet.url()],
};

describe('SellerSpider', () => {
  describe('getNextPage', () => {
    it('should return next page url', () => {
      const pageParam = 'PAGE-PARAM';
      const pageNum = faker.datatype.number();
      const url = `https://naver.com?foo=bar&${pageParam}=${pageNum}`;

      const spider = new SellerSpider({
        crawlInfo: {
          ...CRAWL_INFO_DATA,
          pagination: true,
          pageParam,
        },
      });

      const result = spider.getNextPage(url);
      expect(new URLSearchParams(result).get(pageParam)).toEqual(
        (pageNum + 1).toString()
      );
    });

    it('should return null when param value is undefined', () => {
      const pageParam = 'PAGE-PARAM';

      const spider = new SellerSpider({
        crawlInfo: {
          ...CRAWL_INFO_DATA,
          pagination: true,
          pageParam,
        },
      });

      expect(spider.getNextPage(faker.internet.url())).toEqual(null);
    });

    it('should return null when pagination is not available', () => {
      const spider = new SellerSpider({
        crawlInfo: {
          ...CRAWL_INFO_DATA,
          pagination: false,
        },
      });
      expect(spider.getNextPage(faker.internet.url())).toEqual(null);
    });
  });

  describe('removeDuplicatedUrls', () => {
    it('should return clean url', () => {
      const spider = new SellerSpider({
        crawlInfo: {
          ...CRAWL_INFO_DATA,
          codeRegex: '/\\?foo=(\\d+)/',
        },
      });

      const firstUrl = 'https://naver.com/?foo=123';
      const secondUrl = 'https://naver.com/abc?foo=123';

      const result = spider.removeDuplicatedUrls([
        firstUrl,
        firstUrl,
        secondUrl,
      ]);
      expect(result).toEqual([firstUrl]);
    });
  });
});
