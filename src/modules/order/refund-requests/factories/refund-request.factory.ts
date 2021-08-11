import { OrderItem } from '@order/order-items/models';
import { ShipmentOwnerType } from '@order/shipments/constants';
import { CreateShipmentInput } from '@order/shipments/dtos';
import { ShipmentFactory } from '@order/shipments/factories';

import { RefundRequestStatus } from '../constants';

import { RefundRequest } from '../models';

export class RefundRequestFactory {
  static create(
    userId: number,
    orderItems: OrderItem[],
    input: Pick<RefundRequest, 'amount' | 'faultOf' | 'reason'> & {
      shipmentInput?: CreateShipmentInput;
    }
  ): RefundRequest {
    const result = new RefundRequest({
      ...input,
      userId,
      status: RefundRequestStatus.Requested,
      orderItems,
      sellerId: orderItems[0].sellerId,
    });

    if (input.shipmentInput) {
      result.shipment = ShipmentFactory.create({
        ...input.shipmentInput,
        ownerType: ShipmentOwnerType.ExchangeRequestPick,
        ownerPk: null,
      });
    }

    return result;
  }
}
