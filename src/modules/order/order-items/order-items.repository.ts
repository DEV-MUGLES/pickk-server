import { NotFoundException } from '@nestjs/common';
import { EntityRepository, In, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { OrderItemClaimStatus, OrderItemStatus } from './constants';
import { OrderItemEntity } from './entities';
import { OrderItem } from './models';

@EntityRepository(OrderItemEntity)
export class OrderItemsRepository extends Repository<OrderItemEntity> {
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

  async get(
    merchantUid: string,
    relations: string[] = []
  ): Promise<OrderItem | null> {
    return await this.findOne({
      where: { merchantUid },
      relations,
    })
      .then((entity) => {
        if (!entity) {
          throw new NotFoundException('해당 주문상품이 존재하지 않습니다.');
        }

        return Promise.resolve(this.entityToModel(entity));
      })
      .catch((error) => Promise.reject(error));
  }

  async checkBelongsTo(merchantUid: string, userId: number): Promise<boolean> {
    const result = await this.createQueryBuilder('orderItem')
      .select('1')
      .where('orderItem.merchantUid = :merchantUid', { merchantUid })
      .andWhere('orderItem.userId = :userId', { userId })
      .execute();
    return result?.length > 0;
  }

  async countActive(userId: number): Promise<number> {
    const { VbankReady, Paid, ShipPending, ShipReady, Shipping } =
      OrderItemStatus;
    const activeStatuses = [VbankReady, Paid, ShipPending, ShipReady, Shipping];

    const { CancelRequested, ExchangeRequested, RefundRequested } =
      OrderItemClaimStatus;
    const activeClaimStatuses = [
      CancelRequested,
      ExchangeRequested,
      RefundRequested,
    ];

    return await this.count({
      where: [
        {
          userId,
          status: In(activeStatuses),
          claimStatus: null,
          isConfirmed: false,
        },
        {
          userId,
          claimStatus: In(activeClaimStatuses),
          isConfirmed: false,
        },
      ],
    });
  }
}
