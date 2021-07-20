import { ObjectType } from '@nestjs/graphql';

import { OrderBuyerEntity } from '../entities';

@ObjectType()
export class OrderBuyer extends OrderBuyerEntity {}
