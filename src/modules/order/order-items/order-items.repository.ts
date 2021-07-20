import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@common/base.repository';

import { OrderItemEntity } from './entities';
import { OrderItem } from './models';

@EntityRepository(OrderItemEntity)
export class OrderItemsRepository extends BaseRepository<
  OrderItemEntity,
  OrderItem
> {
  entityToModel(entity: OrderItemEntity, transformOptions = {}): OrderItem {
    return plainToClass(OrderItem, entity, transformOptions) as OrderItem;
  }

  entityToModelMany(
    entities: OrderItemEntity[],
    transformOptions = {}
  ): OrderItem[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}
