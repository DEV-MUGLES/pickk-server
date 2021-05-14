import { ISellerCrawlStrategy } from '@item/sellers/interfaces/seller-crawl-strategy.interface';

import { ISpiderItem } from '../interfaces/spider.interface';

export type SpiderSellerRequestDto = Omit<
  ISellerCrawlStrategy,
  'baseUrl' | 'startPathNamesJoin'
> & {
  brandName: string;
  brandId: number;

  startUrls: string[];
};

export type SpiderSellerResultDto = {
  brandName: string;
  brandId: number;
  codeRegex: string;

  items: ISpiderItem[];
};
