import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not } from 'typeorm';
import { plainToClass } from 'class-transformer';
import dayjs from 'dayjs';

import { BaseStep } from '@batch/jobs/base.step';
import { JobExecutionContext } from '@batch/models';
import { DeliveryTrackerService } from '@providers/delivery-tracker';

import { ExchangeRequestsService } from '@order/exchange-requests/exchange-requests.service';
import { OrderItemStatus } from '@order/order-items/constants';
import { OrderItemsProducer } from '@order/order-items/producers';
import { OrderItemsRepository } from '@order/order-items/order-items.repository';
import { ShipmentOwnerType, ShipmentStatus } from '@order/shipments/constants';
import { ShipmentHistoryEntity } from '@order/shipments/entities';
import { Shipment, ShipmentHistory } from '@order/shipments/models';
import {
  ShipmentHistoriesRepository,
  ShipmentsRepository,
} from '@order/shipments/shipments.repository';

const SHIPPED_STATUS_TEXT = '배송완료';

@Injectable()
export class TrackShipmentsStep extends BaseStep {
  constructor(
    private readonly deliveryTrackerService: DeliveryTrackerService,
    @InjectRepository(ShipmentsRepository)
    private readonly shipmentsRepository: ShipmentsRepository,
    @InjectRepository(ShipmentHistoriesRepository)
    private readonly shipmentsHistoriesRepository: ShipmentHistoriesRepository,
    @InjectRepository(OrderItemsRepository)
    private readonly orderItemsRepository: OrderItemsRepository,
    private readonly exchangeRequestsService: ExchangeRequestsService,
    private readonly orderItemsProducer: OrderItemsProducer
  ) {
    super();
  }

  async tasklet(context: JobExecutionContext): Promise<void> {
    const shipments = this.shipmentsRepository.entityToModelMany(
      await this.shipmentsRepository.find({
        where: { status: ShipmentStatus.Shipping, ownerPk: Not(IsNull()) },
        relations: ['courier', 'histories'],
      })
    );

    for (const shipment of shipments) {
      try {
        const recentHistories = await this.getRecentHistories(shipment);
        if (!recentHistories) {
          continue;
        }

        const duplicatedHistories = this.findDuplicatedHistories(
          shipment.histories
        );
        const deletedHistories = this.findDeletedHistories(
          shipment.histories,
          recentHistories
        );

        delete shipment.histories;
        await this.shipmentsHistoriesRepository.save(recentHistories);
        await this.shipmentsHistoriesRepository.remove([
          ...deletedHistories,
          ...duplicatedHistories,
        ]);

        if (this.isShippedShipment(recentHistories)) {
          shipment.status = ShipmentStatus.Shipped;
          await this.processShippedShipment(shipment);
        }

        shipment.lastTrackedAt = new Date();
        await this.shipmentsRepository.save(shipment);
      } catch (err) {
        context.put(
          shipment.id.toString(),
          err.message + '/' + err?.config?.url
        );
      }
    }
  }

  private async getRecentHistories(shipment: Shipment) {
    const { courier, trackCode } = shipment;
    const trackHistoryResult = await this.deliveryTrackerService.trackHistory(
      courier.code,
      trackCode
    );
    const histories = plainToClass(ShipmentHistory, shipment.histories);

    return trackHistoryResult.map((input) => {
      const existingHistory = histories.filter(
        (history) =>
          dayjs(input.time).isSame(history.time) &&
          input.statusText === history.statusText &&
          input.locationName === history.locationName
      )[0];
      return (
        existingHistory ??
        new ShipmentHistory({
          ...input,
          shipmentId: shipment.id,
        })
      );
    });
  }

  private findDeletedHistories(
    histories: ShipmentHistory[],
    recentHistories: ShipmentHistory[]
  ) {
    return histories.filter(
      (history) =>
        !recentHistories.find((recentHistory) => recentHistory.isEqual(history))
    );
  }

  private findDuplicatedHistories(historyEntities: ShipmentHistoryEntity[]) {
    const histories = plainToClass(ShipmentHistory, historyEntities);
    return histories.filter(
      (history, index) =>
        histories.findIndex((history2) => history2.isEqual(history)) !== index
    );
  }

  private async processShippedShipment(shipment: Shipment) {
    const { ownerPk, ownerType } = shipment;
    if (ownerType === ShipmentOwnerType.OrderItem) {
      await this.orderItemsRepository.update(ownerPk, {
        status: OrderItemStatus.Shipped,
        shippedAt: new Date(),
      });
      await this.orderItemsProducer.indexOrderItems([ownerPk]);
    }
    if (ownerType === ShipmentOwnerType.ExchangeRequestReship) {
      await this.exchangeRequestsService.markReshipped(ownerPk);
    }
  }

  private isShippedShipment(histories: ShipmentHistory[]) {
    if (histories.length === 0) return false;
    return histories[histories.length - 1].statusText === SHIPPED_STATUS_TEXT;
  }
}
