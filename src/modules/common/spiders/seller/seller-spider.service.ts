import { Injectable } from '@nestjs/common';

import { ISellerCrawlStrategy } from '@item/sellers/interfaces';

import { SellersSpiderFactory } from './factories';

@Injectable()
export class SellerSpiderService {
  async getItemUrls(sellerCrawlStrategy: ISellerCrawlStrategy) {
    const spider = SellersSpiderFactory.create(sellerCrawlStrategy);
    return await spider.collectUrls();
  }
}
