import { Module } from '@nestjs/common';

import { ImagesModule } from './images/images.module';
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [ImagesModule, JobsModule],
})
export class CommonModule {}
