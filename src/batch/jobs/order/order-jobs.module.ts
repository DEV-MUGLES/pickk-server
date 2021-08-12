import { Module } from '@nestjs/common';

import { BatchWorker } from '@batch/batch.worker';
import { JobsModule } from '@mcommon/jobs/jobs.module';

import { ProcessDelayedExchangeRequestsJob } from './process-delayed-exchange-requests/job';
import { ProcessDelayedOrderItemsJob } from './process-delayed-order-items';
import { ProcessDelayedRefundRequestsJob } from './process-delayed-refund-requests';

import { OrderJobsController } from './order-jobs.controller';
import { OrderJobsService } from './order-jobs.service';

@Module({
  imports: [JobsModule],
  controllers: [OrderJobsController],
  providers: [
    OrderJobsService,
    BatchWorker,
    ProcessDelayedOrderItemsJob,
    ProcessDelayedExchangeRequestsJob,
    ProcessDelayedRefundRequestsJob,
  ],
})
export class OrderJobsModule {}
