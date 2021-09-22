import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
import { In } from 'typeorm';

import { BaseStep } from '@batch/jobs/base.step';
import { JobExecutionContext } from '@batch/models';
import { OrderItemsRepository } from '@order/order-items/order-items.repository';
import { OrderItemStatus } from '@order/order-items/constants';

const DEFAULT_OLD_DATE = dayjs(new Date(2000, 1, 1));
dayjs.extend(minMax);

@Injectable()
export class UpdateDelayedOrderItemsStep extends BaseStep {
  constructor(private readonly orderItemsRepository: OrderItemsRepository) {
    super();
  }

  async tasklet(context: JobExecutionContext) {
    const unprocessedOrderItems = await this.orderItemsRepository.find({
      select: [
        'paidAt',
        'delayedShipExpectedAt',
        'shipReservedAt',
        'merchantUid',
      ],
      where: {
        status: In([
          OrderItemStatus.PAID,
          OrderItemStatus.SHIP_READY,
          OrderItemStatus.SHIP_PENDING,
        ]),
      },
    });

    const delayedOrderItems = unprocessedOrderItems.filter((oi) => {
      const { paidAt, delayedShipExpectedAt, shipReservedAt } = oi;
      return this.getLastDay(paidAt, delayedShipExpectedAt, shipReservedAt)
        .add(1, 'day')
        .isBefore(dayjs());
    });

    delayedOrderItems.forEach((o) => {
      o.isProcessDelaying = true;
    });

    await this.orderItemsRepository.save(delayedOrderItems);
    context.put('delayedOrderItemCount', delayedOrderItems.length);
  }

  getLastDay(
    paidAt: Date,
    delayedShipExpectedAt: Date,
    shipReservedAt: Date
  ): dayjs.Dayjs {
    return dayjs.max(
      dayjs(paidAt).add(1, 'day'),
      delayedShipExpectedAt ? dayjs(delayedShipExpectedAt) : DEFAULT_OLD_DATE,
      shipReservedAt ? dayjs(shipReservedAt) : DEFAULT_OLD_DATE
    );
  }
}
