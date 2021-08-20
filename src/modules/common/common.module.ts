import { Module } from '@nestjs/common';

import { HitsModule } from './hits/hits.module';
import { ImagesModule } from './images/images.module';
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [HitsModule, ImagesModule, JobsModule],
})
export class CommonModule {}
