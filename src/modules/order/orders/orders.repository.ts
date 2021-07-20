import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@common/base.repository';

import { OrderEntity } from './entities';
import { Order } from './models';

@EntityRepository(OrderEntity)
export class OrdersRepository extends BaseRepository<OrderEntity, Order> {
  entityToModel(entity: OrderEntity, transformOptions = {}): Order {
    return plainToClass(Order, entity, transformOptions) as Order;
  }

  entityToModelMany(entities: OrderEntity[], transformOptions = {}): Order[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}
