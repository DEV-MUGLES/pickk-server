import { ObjectType } from '@nestjs/graphql';

import { OrderItemEntity } from '../entities';

@ObjectType()
export class OrderItem extends OrderItemEntity {}
