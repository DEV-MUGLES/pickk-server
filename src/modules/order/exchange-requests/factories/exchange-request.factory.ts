import { InternalServerErrorException } from '@nestjs/common';

import { Product } from '@item/products/models';
import { RequestOrderItemExchangeInput } from '@order/order-items/dtos';
import { ShipmentOwnerType } from '@order/shipments/constants';
import { ShipmentFactory } from '@order/shipments/factories';

import { ExchangeRequestStatus } from '../constants';
import { ExchangeRequest } from '../models';

export class ExchangeRequestFactory {
  static create(
    userId: number,
    sellerId: number,
    product: Product,
    input: RequestOrderItemExchangeInput,
    quantity: number
  ): ExchangeRequest {
    if (!product.item || !product.itemOptionValues?.length) {
      throw new InternalServerErrorException(
        'product의 item, itemOptionValues를 join해야합니다.'
      );
    }

    const itemName = product.item.name;
    const productVariantName = product.itemOptionValues
      .map(({ name }) => name)
      .join('/');

    const result = new ExchangeRequest({
      userId,
      sellerId,
      product,
      status: ExchangeRequestStatus.Requested,
      ...input,
      quantity,
      itemName,
      productVariantName,
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
