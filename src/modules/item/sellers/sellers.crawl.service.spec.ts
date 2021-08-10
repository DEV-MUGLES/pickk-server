import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';

import { SellersCrawlService } from './sellers.crawl.service';

describe('SellersCrawlService', () => {
  let sellersCrawlService: SellersCrawlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [SellersCrawlService],
    }).compile();
    sellersCrawlService = module.get<SellersCrawlService>(SellersCrawlService);
  });

  describe('getNextPage', () => {
    it("when pageParam doesn't exist in url, should return next page url's pageParam value 2", () => {
      const pageParam = 'PAGE-PARAM';
      const url = `https://naver.com?foo=bar`;

      const result = sellersCrawlService.getNextPage(url, true, pageParam);

      expect(new URLSearchParams(result).get(pageParam)).toEqual('2');
    });
    it('should return next page url', () => {
      const pageParam = 'PAGE-PARAM';
      const pageNum = faker.datatype.number();
      const url = `https://naver.com?foo=bar&${pageParam}=${pageNum}`;

      const result = sellersCrawlService.getNextPage(url, true, pageParam);

      expect(new URLSearchParams(result).get(pageParam)).toEqual(
        (pageNum + 1).toString()
      );
    });

    it('should return null when param value is undefined', () => {
      expect(
        sellersCrawlService.getNextPage(faker.internet.url(), true, undefined)
      ).toEqual(null);
    });

    it('should return null when pagination is not available', () => {
      const pageParam = 'PAGE-PARAM';
      expect(
        sellersCrawlService.getNextPage(faker.internet.url(), false, pageParam)
      ).toEqual(null);
    });
  });

  describe('removeDuplicatedUrls', () => {
    it('should return clean url', () => {
      const codeRegex = '/\\?foo=(\\d+)/';
      const firstUrl = 'https://naver.com/?foo=123';
      const secondUrl = 'https://naver.com/abc?foo=123';

      const result = sellersCrawlService.removeDuplicatedUrls(
        [firstUrl, firstUrl, secondUrl],
        codeRegex
      );
      expect(result).toEqual([firstUrl]);
    });
  });
});
