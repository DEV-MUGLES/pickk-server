import * as faker from 'faker';

import { getRandomEnumValue } from '@common/helpers';
import { OrderClaimFaultOf } from '@order/refund-requests/constants';
import { RequestOrderRefundInput } from '../dtos';

export class RequestOrderRefundInputCreator {
  static create(
    orderItemMerchantUids: string[],
    withShipment?: boolean
  ): RequestOrderRefundInput {
    const result = new RequestOrderRefundInput();

    result.orderItemMerchantUids = orderItemMerchantUids;
    result.faultOf = getRandomEnumValue(OrderClaimFaultOf) as OrderClaimFaultOf;
    result.reason = faker.lorem.text();

    if (withShipment) {
      result.shipmentInput = {
        courierId: faker.datatype.number(),
        trackCode: faker.phone.phoneNumber('###########'),
      };
    }

    return result;
  }
}
