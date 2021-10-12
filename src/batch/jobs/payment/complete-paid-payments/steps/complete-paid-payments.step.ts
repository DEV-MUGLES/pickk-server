import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

import { BaseStep } from '@batch/jobs/base.step';

import { OrderStatus } from '@order/orders/constants';
import { OrdersService } from '@order/orders/orders.service';
import { PaymentStatus } from '@payment/payments/constants';
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
      createdAtBetween: [
        dayjs().subtract(3, 'minute').toDate(),
        dayjs().toDate(),
      ],
    });

    if (payments.length === 0) {
      return;
    }

    const orders = await this.ordersService.list({
      merchantUidIn: payments.map((v) => v.merchantUid),
    });

    for (const order of orders.filter((v) => v.status === OrderStatus.Paying)) {
      // 가상계좌 주문건은 제외한다.
      await this.ordersService.complete(order.merchantUid);
    }
  }
}
