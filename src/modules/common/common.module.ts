import { Module } from '@nestjs/common';

import { ImagesModule } from './images/images.module';
import { JobsModule } from './jobs/jobs.module';
import { SpidersModule } from './spiders/spiders.module';

@Module({
  imports: [ImagesModule, JobsModule, SpidersModule],
})
export class CommonModule {}
