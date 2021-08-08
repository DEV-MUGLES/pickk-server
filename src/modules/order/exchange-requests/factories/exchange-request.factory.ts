import { InternalServerErrorException } from '@nestjs/common';
import { RequestOrderItemExchangeInput } from '@order/order-items/dtos';

import { Product } from '@item/products/models';

import { ExchangeRequestStatus } from '../constants';
import { ExchangeRequest } from '../models';

export class ExchanteRequestFactory {
  static create(
    userId: number,
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

    return new ExchangeRequest({
      userId,
      product,
      status: ExchangeRequestStatus.Requested,
      ...input,
      quantity,
      itemName,
      productVariantName,
    });
  }
}
