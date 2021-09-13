import { ObjectType } from '@nestjs/graphql';

import { SaleStrategyEntity } from '../entities';

@ObjectType()
export class SaleStrategy extends SaleStrategyEntity {}
