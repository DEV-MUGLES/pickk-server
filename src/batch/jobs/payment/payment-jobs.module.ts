import { Module } from '@nestjs/common';

import { BatchWorker } from '@batch/batch.worker';

import { JobsModule } from '@mcommon/jobs/jobs.module';
import { OrdersModule } from '@order/orders/orders.module';
import { PaymentsModule } from '@payment/payments/payments.module';

import {
  CompletePaidPaymentsJob,
  CompletePaidPaymentsStep,
} from './complete-paid-payments';

import { PaymentJobsController } from './payment-jobs.controller';
import { PaymentJobsService } from './payment-jobs.service';

@Module({
  imports: [JobsModule, PaymentsModule, OrdersModule],
  controllers: [PaymentJobsController],
  providers: [
    BatchWorker,

    PaymentJobsService,

    CompletePaidPaymentsJob,
    CompletePaidPaymentsStep,
  ],
})
export class PaymentJobsModule {}
