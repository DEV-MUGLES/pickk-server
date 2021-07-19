import { ObjectType } from '@nestjs/graphql';

import { SellerCrawlPolicyEntity } from '../../entities/policies';

@ObjectType()
export class SellerCrawlPolicy extends SellerCrawlPolicyEntity {}
