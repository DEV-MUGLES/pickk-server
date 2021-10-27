import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import {
  OrderBuyerEntity,
  OrderEntity,
  OrderReceiverEntity,
  OrderRefundAccountEntity,
} from './entities';
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
    merchantUid: string,
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

  async checkExist(merchantUid: string): Promise<boolean> {
    const result = await this.createQueryBuilder('order')
      .select('1')
      .where('order.merchantUid = :merchantUid', { merchantUid })
      .execute();
    return result?.length > 0;
  }

  async checkBelongsTo(merchantUid: string, userId: number): Promise<boolean> {
    const result = await this.createQueryBuilder('order')
      .select('1')
      .where('order.merchantUid = :merchantUid', { merchantUid })
      .andWhere('order.userId = :userId', { userId })
      .execute();
    return result?.length > 0;
  }
}

@EntityRepository(OrderBuyerEntity)
export class OrderBuyersRepository extends Repository<OrderBuyerEntity> {}

@EntityRepository(OrderReceiverEntity)
export class OrderReceiversRepository extends Repository<OrderReceiverEntity> {}

@EntityRepository(OrderRefundAccountEntity)
export class OrderRefundAccountsRepository extends Repository<
  OrderRefundAccountEntity
> {}
