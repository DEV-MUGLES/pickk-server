import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

import { Product } from '@item/products/models';
import { RequestOrderItemExchangeInput } from '@order/order-items/dtos';
import { OrderItem } from '@order/order-items/models';
import { calcClaimShippingFee } from '@order/orders/helpers';
import { ShipmentOwnerType } from '@order/shipments/constants';
import { ShipmentFactory } from '@order/shipments/factories';

import { ExchangeRequestStatus } from '../constants';
import { ExchangeRequest } from '../models';

export class ExchangeRequestFactory {
  static create(
    orderItem: OrderItem,
    product: Product,
    input: RequestOrderItemExchangeInput
  ): ExchangeRequest {
    if (orderItem.itemId !== product.itemId) {
      throw new BadRequestException(
        '같은 아이템의 Product로만 교환할 수 있습니다.'
      );
    }
    if (!product.item || !product.itemOptionValues?.length) {
      throw new InternalServerErrorException(
        'product의 item, itemOptionValues를 join해야합니다.'
      );
    }

    const { userId, sellerId, quantity, itemName } = orderItem;

    const shippingFee = calcClaimShippingFee([orderItem], input.faultOf);
    const productVariantName = product.itemOptionValues
      .map(({ name }) => name)
      .join('/');

    const result = new ExchangeRequest({
      ...input,
      status: ExchangeRequestStatus.Requested,
      userId,
      sellerId,
      quantity,
      product,
      shippingFee,
      productVariantName,
      itemName,
    });

    if (input.shipmentInput) {
      result.pickShipment = ShipmentFactory.create({
        ...input.shipmentInput,
        ownerType: ShipmentOwnerType.ExchangeRequestPick,
        ownerPk: null,
      });
    }

    return result;
  }
}
