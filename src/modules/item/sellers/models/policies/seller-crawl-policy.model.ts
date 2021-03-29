import { ObjectType } from '@nestjs/graphql';

import { SellerCrawlPolicyEntity } from '../../entities/policies/seller-crawl-policy.entity';

@ObjectType()
export class SellerCrawlPolicy extends SellerCrawlPolicyEntity {}
