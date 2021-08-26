import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { DeliveryTrackerService } from './provider.service';

@Module({
  imports: [HttpModule],
  providers: [DeliveryTrackerService],
  exports: [DeliveryTrackerService],
})
export class DeliveryTrackerProviderModule {}
