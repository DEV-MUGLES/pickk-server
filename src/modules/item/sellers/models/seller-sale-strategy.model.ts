import { ObjectType } from '@nestjs/graphql';

import { SellerSaleStrategyEntity } from '../entities';

@ObjectType()
export class SellerSaleStrategy extends SellerSaleStrategyEntity {}
