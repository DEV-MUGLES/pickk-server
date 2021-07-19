import { ObjectType } from '@nestjs/graphql';

import { SellerCrawlStrategyEntity } from '../entities';

@ObjectType()
export class SellerCrawlStrategy extends SellerCrawlStrategyEntity {
  get startUrls(): string[] {
    return this.startPathNamesJoin
      .split('|||')
      .map((pathName) => this.baseUrl + pathName);
  }
}
