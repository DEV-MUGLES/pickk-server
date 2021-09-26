import * as faker from 'faker';

import { getRandomEnumValue } from '@common/helpers';

import { Item, ItemOptionValue } from '@item/items/models';
import { Product } from '@item/products/models';
import { OrderClaimFaultOf } from '@order/refund-requests/constants';

import { RequestOrderItemExchangeInput } from '../dtos';

export class RequestExchangeInputCreator {
  static create(item: Item, withShipment?: boolean) {
    const product = new Product({
      id: faker.datatype.number(),
      itemId: item.id,
      item,
      itemOptionValues: [
        new ItemOptionValue({
          name: faker.name.firstName(),
        }),
      ],
    });

    const result = new RequestOrderItemExchangeInput();

    result.productId = product.id;
    result.reason = faker.lorem.text();
    result.faultOf = getRandomEnumValue(OrderClaimFaultOf) as OrderClaimFaultOf;

    if (withShipment) {
      result.shipmentInput = {
        courierId: faker.datatype.number(),
        trackCode: faker.phone.phoneNumber('############'),
      };
    }

    return { input: result, product };
  }
}
