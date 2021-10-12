import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

import { BaseStep } from '@batch/jobs/base.step';

import { OrderStatus } from '@order/orders/constants';
import { OrdersService } from '@order/orders/orders.service';
import { PaymentStatus, PayMethod } from '@payment/payments/constants';
import { PaymentsService } from '@payment/payments/payments.service';

@Injectable()
export class CompletePaidPaymentsStep extends BaseStep {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly ordersService: OrdersService
  ) {
    super();
  }

  async tasklet() {
    const payments = await this.paymentsService.list({
      statusIn: [PaymentStatus.Paid],
      paidAtBetween: [
        dayjs().subtract(3, 'minute').toDate(),
        dayjs().subtract(30, 'second').toDate(),
      ],
    });

    if (payments.length === 0) {
      return;
    }

    const orders = await this.ordersService.list({
      merchantUidIn: payments.map((v) => v.merchantUid),
      statusIn: [OrderStatus.Paying],
    });

    for (const order of orders) {
      // 가상계좌 주문건은 제외한다.
      if (order.payMethod === PayMethod.Vbank) {
        return;
      }

      await this.ordersService.complete(order.merchantUid);
    }
  }
}
