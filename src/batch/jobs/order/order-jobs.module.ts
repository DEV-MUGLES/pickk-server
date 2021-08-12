import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BatchWorker } from '@batch/batch.worker';
import { JobsModule } from '@mcommon/jobs/jobs.module';
import { OrderItemsRepository } from '@order/order-items/order-items.repository';

import { ProcessDelayedExchangeRequestsJob } from './process-delayed-exchange-requests/job';
import {
  UpdateDelayedOrderItemsStep,
  ProcessDelayedOrderItemsJob,
} from './process-delayed-order-items';
import { ProcessDelayedRefundRequestsJob } from './process-delayed-refund-requests';

import { OrderJobsController } from './order-jobs.controller';
import { OrderJobsService } from './order-jobs.service';

@Module({
  imports: [JobsModule, TypeOrmModule.forFeature([OrderItemsRepository])],
  controllers: [OrderJobsController],
  providers: [
    OrderJobsService,
    BatchWorker,
    ProcessDelayedOrderItemsJob,
    ProcessDelayedExchangeRequestsJob,
    ProcessDelayedRefundRequestsJob,
    UpdateDelayedOrderItemsStep,
  ],
})
export class OrderJobsModule {}
