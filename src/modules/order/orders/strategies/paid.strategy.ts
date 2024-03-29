import { BadRequestException } from '@nestjs/common';

import { PayMethod } from '@payment/payments/constants';

import { OrderStatus } from '../constants';

import { OrderProcessStrategy } from './base.strategy';

export class OrderPaidStrategy extends OrderProcessStrategy {
  status = OrderStatus.Paid;
  statusChangedField = 'paidAt' as const;

  validate() {
    if (
      this.order.payMethod === PayMethod.Vbank &&
      this.order.status === OrderStatus.VbankReady
    ) {
      // 가상계좌건이고 입금대기 상태 OK
      return;
    }
    if (
      this.order.payMethod !== PayMethod.Vbank &&
      this.order.status === OrderStatus.Paying
    ) {
      // 가상계좌건이 아니고 결제중인 상태 OK
      return;
    }
    throw new BadRequestException('결제 완료 처리할 수 없습니다.');
  }

  execute() {
    super.execute();
    for (const orderItem of this.order.orderItems) {
      orderItem.markPaid();
    }
  }
}
