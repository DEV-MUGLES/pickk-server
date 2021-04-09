import { ObjectType } from '@nestjs/graphql';

import { SellerCrawlStrategyEntity } from '../entities/seller-crawl-strategy.entity';

@ObjectType()
export class SellerCrawlStrategy extends SellerCrawlStrategyEntity {
  get startUrls(): string[] {
    return this.startPathNamesJoin
      .split('|||')
      .map((pathName) => this.baseUrl + pathName);
  }
}
