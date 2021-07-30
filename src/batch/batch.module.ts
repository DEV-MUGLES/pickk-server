import { Module } from '@nestjs/common';

import { ItemJobModule } from './jobs/item/item-job.module';

@Module({
  imports: [ItemJobModule],
  providers: [],
})
export class BatchModule {}
