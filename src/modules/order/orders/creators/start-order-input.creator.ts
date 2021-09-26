import * as faker from 'faker';

import { BankCode } from '@common/constants';
import { getRandomEnumValue, getRandomIntBetween } from '@common/helpers';

import { PayMethod } from '@payment/payments/constants';

import {
  OrderBuyerInput,
  OrderReceiverInput,
  OrderRefundAccountInput,
  StartOrderInput,
} from '../dtos';
import { Order } from '../models';

export class StartOrderInputCreator {
  static create(order: Order): StartOrderInput {
    const result = new StartOrderInput();

    result.payMethod = getRandomEnumValue(PayMethod) as PayMethod;
    result.usedPointAmount = getRandomIntBetween(0, order.totalPayAmount);

    result.buyerInput = this.createBuyerInput();
    result.receiverInput = this.createReceiverInput();

    if (result.payMethod === PayMethod.Vbank) {
      result.refundAccountInput = this.createRefundAccountInput();
    }

    return result;
  }

  static createBuyerInput(): OrderBuyerInput {
    const result = new OrderBuyerInput();

    result.name = faker.name.firstName();
    result.email = faker.internet.email();
    result.phoneNumber = '010' + faker.phone.phoneNumber('########');

    return result;
  }

  static createReceiverInput(): OrderReceiverInput {
    const result = new OrderReceiverInput();

    result.message = faker.lorem.text();
    result.shippingAddressId = faker.datatype.number();

    return result;
  }

  static createRefundAccountInput(): OrderRefundAccountInput {
    const result = new OrderRefundAccountInput();

    result.bankCode = getRandomEnumValue(BankCode) as BankCode;
    result.number = faker.phone.phoneNumber('######-##-######');
    result.ownerName = faker.name.firstName();

    return result;
  }
}
