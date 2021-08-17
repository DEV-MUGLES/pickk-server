import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
import { In } from 'typeorm';

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
    const unprocessedOrderItems = await this.orderItemsRepository.find({
      status: In([
        OrderItemStatus.Paid,
        OrderItemStatus.ShipReady,
        OrderItemStatus.ShipPending,
      ]),
    });

    const delayedOrderItems = unprocessedOrderItems.filter((o) => {
      const { paidAt, delayedShipExpectedAt, shipReservedAt } = o;
      return this.getLastDay(paidAt, delayedShipExpectedAt, shipReservedAt)
        .add(1, 'day')
        .isBefore(dayjs());
    });

    delayedOrderItems.forEach((o) => {
      o.isProcessDelaying = true;
    });

    await this.orderItemsRepository.save(delayedOrderItems);
  }

  getLastDay(
    paidAt: Date,
    delayedShipExpectedAt: Date,
    shipReservedAt: Date
  ): dayjs.Dayjs {
    const paidDay = dayjs(paidAt).add(1, 'days');
    const delayedShipExpectedDay = dayjs(delayedShipExpectedAt);
    const shipReservedDay = dayjs(shipReservedAt);

    if (delayedShipExpectedAt === null && shipReservedAt === null) {
      return paidDay;
    }
    if (delayedShipExpectedAt === null) {
      return dayjs.max(paidDay, shipReservedDay);
    }
    if (shipReservedAt === null) {
      return dayjs.max(paidDay, delayedShipExpectedDay);
    }
    return dayjs.max(paidDay, delayedShipExpectedDay, shipReservedDay);
  }
}
