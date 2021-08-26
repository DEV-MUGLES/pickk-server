import { Module } from '@nestjs/common';

import { HitsModule } from './hits/hits.module';
import { ImagesModule } from './images/images.module';
import { JobsModule } from './jobs/jobs.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [HitsModule, ImagesModule, JobsModule, SearchModule],
})
export class CommonModule {}
