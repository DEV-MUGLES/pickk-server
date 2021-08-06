import { ISellerCrawlStrategy } from '@item/sellers/interfaces';
import { ISellerCrawlInfo } from '../interfaces';
import { SellerSpider } from '../models/seller-spider.model';

export class SellersSpiderFactory {
  static create(sellerCrawlStrategy: ISellerCrawlStrategy) {
    const { startPathNamesJoin, baseUrl } = sellerCrawlStrategy;

    const startUrls = startPathNamesJoin
      .split('<>')
      .map((pathName) => baseUrl + pathName);
    const origin = new URL(startUrls[0]).origin;

    return new SellerSpider({
      crawlInfo: {
        startUrls,
        ...(sellerCrawlStrategy as ISellerCrawlInfo),
      },
      origin,
    });
  }
}
