import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
import { In, Not } from 'typeorm';

import { BaseStep } from '@batch/jobs/base.step';
import { OrderItemsRepository } from '@order/order-items/order-items.repository';
import { OrderItemStatus } from '@order/order-items/constants';

const DEFAULT_OLD_DATE = dayjs(new Date(2000, 1, 1));
dayjs.extend(minMax);

@Injectable()
export class UpdateDelayedOrderItemsStep extends BaseStep {
  constructor(private readonly orderItemsRepository: OrderItemsRepository) {
    super();
  }

  async tasklet() {
    const delayedOrderItems = (
      await this.orderItemsRepository.find({
        where: {
          status: In([
            OrderItemStatus.Paid,
            OrderItemStatus.ShipReady,
            OrderItemStatus.ShipPending,
          ]),
          claimStatus: null,
        },
      })
    ).filter(({ paidAt, delayedShipExpectedAt, shipReservedAt }) =>
      this.isDelayed(paidAt, delayedShipExpectedAt, shipReservedAt)
    );
    delayedOrderItems.forEach((v) => {
      v.isProcessDelaying = true;
    });

    const processedOrderItems = await this.orderItemsRepository.find({
      where: [
        {
          status: In([OrderItemStatus.Shipped, OrderItemStatus.Shipping]),
          isProcessDelaying: true,
        },
        {
          claimStatus: Not(null),
          isProcessDelaying: true,
        },
      ],
    });
    processedOrderItems.forEach((v) => {
      v.isProcessDelaying = false;
    });

    await this.orderItemsRepository.save([
      ...delayedOrderItems,
      ...processedOrderItems,
    ]);
  }

  private getLastDay(
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

  private isDelayed(
    paidAt: Date,
    delayedShipExpectedAt: Date,
    shipReservedAt: Date
  ) {
    return this.getLastDay(
      paidAt,
      delayedShipExpectedAt,
      shipReservedAt
    ).isBefore(dayjs().subtract(1, 'day'));
  }
}
