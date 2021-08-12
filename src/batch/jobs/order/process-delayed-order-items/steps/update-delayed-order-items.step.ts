import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';

import { BaseStep } from '@batch/jobs/base.step';
import { OrderItemsRepository } from '@order/order-items/order-items.repository';
import { OrderItemStatus } from '@order/order-items/constants';

dayjs.extend(minMax);

@Injectable()
export class UpdateDelayedOrderItemsStep extends BaseStep {
  constructor(private readonly orderItemsRepository: OrderItemsRepository) {
    super();
  }

  async tasklet() {
    const orderItems = await this.getOrderItems();

    const delayedOrderItems = orderItems.filter((o) => {
      const { paidAt, delayedShipExpectedAt, shipReservedAt } = o;
      const lastDay = dayjs.max(
        dayjs(paidAt),
        dayjs(delayedShipExpectedAt),
        dayjs(shipReservedAt)
      );
      return lastDay.isBefore(dayjs());
    });

    delayedOrderItems.forEach((o) => {
      o.isProcessDelaying = true;
    });

    await this.orderItemsRepository.save(delayedOrderItems);
  }

  /** status가 paid, ship_ready, ship_pending인 orderItem 리스트를 반환합니다. */
  async getOrderItems() {
    return await this.orderItemsRepository.find({
      where: [
        { status: OrderItemStatus.Paid },
        { status: OrderItemStatus.ShipReady },
        { status: OrderItemStatus.ShipPending },
      ],
    });
  }
}
