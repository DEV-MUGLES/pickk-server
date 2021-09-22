import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThanOrEqual } from 'typeorm';
import dayjs from 'dayjs';

import { OrderItemStatus } from '@order/order-items/constants';
import { ShipOrderItemInput } from '@order/order-items/dtos';
import { OrderItem } from '@order/order-items/models';
import { OrderItemsRepository } from '@order/order-items/order-items.repository';

import { ExtendedShipOrderItemInput, OrderItemsCountOutput } from './dtos';

@Injectable()
export class SellerOrderItemService {
  constructor(
    @InjectRepository(OrderItemsRepository)
    private readonly orderItemsRepository: OrderItemsRepository
  ) {}

  async getCount(sellerId: number, month = 3): Promise<OrderItemsCountOutput> {
    const orderItems = await this.orderItemsRepository.find({
      select: ['status', 'claimStatus', 'isProcessDelaying', 'isConfirmed'],
      where: {
        sellerId,
        merchantUid: MoreThanOrEqual(
          dayjs().subtract(month, 'month').format(`YYMMDD`) + '0000000000000'
        ),
      },
    });

    return OrderItemsCountOutput.create(sellerId, orderItems);
  }

  async bulkShipReady(sellerId: number, merchantUids: string[]) {
    const orderItems = this.orderItemsRepository.entityToModelMany(
      await this.orderItemsRepository.find({
        where: {
          merchantUid: In(merchantUids),
        },
      })
    );

    if (orderItems.some((oi) => oi.sellerId !== sellerId)) {
      const { merchantUid } = orderItems.find((oi) => oi.sellerId !== sellerId);
      throw new ForbiddenException(
        `입력된 주문상품 ${merchantUid}가 본인의 주문상품이 아닙니다.`
      );
    }

    if (orderItems.some((oi) => oi.status !== OrderItemStatus.PAID)) {
      const { merchantUid } = orderItems.find(
        (oi) => oi.status !== OrderItemStatus.PAID
      );
      throw new BadRequestException(
        `입력된 주문상품 ${merchantUid}가 결제완료 상태가 아닙니다.`
      );
    }

    orderItems.forEach((oi) => oi.markShipReady());
    await this.orderItemsRepository.save(orderItems);
  }

  async ship(orderItem: OrderItem, input: ShipOrderItemInput) {
    orderItem.ship(input);
    await this.orderItemsRepository.save(orderItem);
  }

  async updateTrackCode(orderItem: OrderItem, trackCode: string) {
    if (!orderItem.shipment) {
      throw new NotFoundException(
        '해당 주문상품의 배송 정보가 존재하지 않습니다.'
      );
    }

    orderItem.shipment.trackCode = trackCode;
    await this.orderItemsRepository.save(orderItem);
  }

  async bulkShip(
    orderItems: OrderItem[],
    inputs: ExtendedShipOrderItemInput[]
  ) {
    for (const oi of orderItems) {
      const input = inputs.find((i) => i.merchantUid === oi.merchantUid);
      oi.ship(input);
    }

    await this.orderItemsRepository.save(orderItems);
  }
}
