import { ISellerCrawlStrategy } from '@src/modules/item/sellers/interfaces/seller-crawl-strategy.interface';

export type SpiderSellerRequestDto = Omit<
  ISellerCrawlStrategy,
  'baseUrl' | 'startPathNamesJoin'
> & {
  brandName: string;
  brandId: number;

  startUrls: string[];
};
