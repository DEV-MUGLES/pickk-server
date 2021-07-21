import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { OrderEntity } from './entities';
import { Order } from './models';

@EntityRepository(OrderEntity)
export class OrdersRepository extends Repository<OrderEntity> {
  entityToModel(entity: OrderEntity, transformOptions = {}): Order {
    return plainToClass(Order, entity, transformOptions) as Order;
  }

  entityToModelMany(entities: OrderEntity[], transformOptions = {}): Order[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }

  async get(
    merchantUid: number,
    relations: string[] = []
  ): Promise<Order | null> {
    return await this.findOne({
      where: { merchantUid },
      relations,
    })
      .then((entity) => {
        if (!entity) {
          throw new NotFoundException('해당 주문이 존재하지 않습니다.');
        }

        return Promise.resolve(this.entityToModel(entity));
      })
      .catch((error) => Promise.reject(error));
  }
}
