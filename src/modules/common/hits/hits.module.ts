import { Module } from '@nestjs/common';

import { HitsResolver } from './hits.resolver';
import { HitsService } from './hits.service';

@Module({
  providers: [HitsResolver, HitsService],
})
export class HitsModule {}
