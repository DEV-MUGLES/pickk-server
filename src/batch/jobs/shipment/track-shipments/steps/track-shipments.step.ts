import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseStep } from '@batch/jobs/base.step';
import { allSettled } from '@common/helpers';
import { Shipment, ShipmentHistory } from '@order/shipments/models';
import { ShipmentOwnerType, ShipmentStatus } from '@order/shipments/constants';
import { ShipmentsRepository } from '@order/shipments/shipments.repository';
import { OrderItemsRepository } from '@order/order-items/order-items.repository';
import { OrderItemStatus } from '@order/order-items/constants';
import { DeliveryTrackerService } from '@providers/delivery-tracker';

const SHIPPED_STATUS_TEXT = '배송완료';

@Injectable()
export class TrackShipmentsStep extends BaseStep {
  constructor(
    private readonly deliveryTrackerService: DeliveryTrackerService,
    @InjectRepository(ShipmentsRepository)
    private readonly shipmentsRepository: ShipmentsRepository,
    @InjectRepository(OrderItemsRepository)
    private readonly orderItemsRepository: OrderItemsRepository
  ) {
    super();
  }

  async tasklet(): Promise<void> {
    const shipments = this.shipmentsRepository.entityToModelMany(
      await this.shipmentsRepository.find({
        where: { status: ShipmentStatus.Shipping },
        relations: ['courier', 'histories'],
      })
    );

    await allSettled(
      shipments.map(
        (shipment) =>
          new Promise(async (resolve, reject) => {
            try {
              shipment.histories = await this.getNewHistories(shipment);
              shipment.lastTrackedAt = new Date();
              if (this.isShippedShipment(shipment)) {
                shipment.status = ShipmentStatus.Shipped;
                await this.processShippedShipment(shipment);
              }
              resolve(await this.shipmentsRepository.save(shipment));
            } catch (err) {
              reject(err);
            }
          })
      )
    );
  }

  private async getNewHistories(shipment: Shipment) {
    const { courier, histories, trackCode, id: shipmentId } = shipment;
    const newHistories = (
      await this.deliveryTrackerService.trackHistory(courier.code, trackCode)
    ).map(
      (input) =>
        new ShipmentHistory({
          ...input,
          shipmentId,
        })
    );

    return newHistories.map((newHistory) => {
      const existHistory = histories.filter((history) =>
        newHistory.isEqual(history)
      )[0];
      return existHistory ?? newHistory;
    });
  }

  private async processShippedShipment(shipment: Shipment) {
    const { ownerPk, ownerType } = shipment;
    if (ownerType === ShipmentOwnerType.OrderItem) {
      await this.orderItemsRepository.update(ownerPk, {
        status: OrderItemStatus.Shipped,
      });
    }
  }

  private async isShippedShipment(shipment: Shipment) {
    const { histories } = shipment;
    return histories[histories.length - 1].statusText === SHIPPED_STATUS_TEXT;
  }
}