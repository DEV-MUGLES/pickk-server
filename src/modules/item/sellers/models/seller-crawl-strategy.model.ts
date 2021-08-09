import { ObjectType } from '@nestjs/graphql';

import { SellerCrawlStrategyEntity } from '../entities';

@ObjectType()
export class SellerCrawlStrategy extends SellerCrawlStrategyEntity {}
