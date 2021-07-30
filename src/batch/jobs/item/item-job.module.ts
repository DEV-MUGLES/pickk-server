import { Module } from '@nestjs/common';
import { JobsModule } from '@src/modules/common/jobs/jobs.module';
import { BatchWorker } from '../../batch.worker';

import { ItemJobController } from './item-job.controller';
import { ConfirmOrderItemsJob } from './jobs/confirm/confirm.job';
import { GetPaidOrderItemsStep } from './jobs/confirm/steps/get-paid-order-items.step';

@Module({
  imports: [JobsModule],
  controllers: [ItemJobController],
  providers: [ConfirmOrderItemsJob, GetPaidOrderItemsStep, BatchWorker],
})
export class ItemJobModule {}
