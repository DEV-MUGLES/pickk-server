import { BadRequestException } from '@nestjs/common';

import { checkInSameSeller } from '@order/order-items/helpers';
import { OrderItem } from '@order/order-items/models';
import { calcClaimAmount, calcClaimShippingFee } from '@order/orders/helpers';
import { ShipmentOwnerType } from '@order/shipments/constants';
import { CreateShipmentInput } from '@order/shipments/dtos';
import { ShipmentFactory } from '@order/shipments/factories';

import { RefundRequestStatus } from '../constants';

import { RefundRequest } from '../models';

export class RefundRequestFactory {
  static create(
    merchantUid: string,
    userId: number,
    orderItems: OrderItem[],
    input: Pick<RefundRequest, 'faultOf' | 'reason'> & {
      shipmentInput?: CreateShipmentInput;
    }
  ): RefundRequest {
    this.validateOrderItems(orderItems);

    const shippingFee = calcClaimShippingFee(orderItems, input.faultOf);
    const amount = calcClaimAmount(orderItems);

    const result = new RefundRequest({
      merchantUid,
      ...input,
      shippingFee,
      amount,
      userId,
      status: RefundRequestStatus.Requested,
      orderItems,
      sellerId: orderItems[0].sellerId,
    });

    if (input.shipmentInput) {
      result.shipment = ShipmentFactory.create({
        ...input.shipmentInput,
        ownerType: ShipmentOwnerType.RefundRequest,
        ownerPk: merchantUid,
      });
    }

    return result;
  }

  private static validateOrderItems(orderItems: OrderItem[]): void {
    if (orderItems.length === 0) {
      throw new BadRequestException('1개 이상의 주문 상품을 입력해주세요.');
    }
    if (checkInSameSeller(orderItems) === false) {
      throw new BadRequestException(
        '한번에 같은 브랜드의 상품만 반품할 수 있습니다.'
      );
    }
  }
}
