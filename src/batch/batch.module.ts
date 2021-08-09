import { Module } from '@nestjs/common';

import { ItemJobsModule } from './jobs/item/item-jobs.module';

@Module({
  imports: [ItemJobsModule],
})
export class BatchModule {}
