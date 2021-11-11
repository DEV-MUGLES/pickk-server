import { Module } from '@nestjs/common';

import { ContentCommonResolver } from './common.resolver';

@Module({
  providers: [ContentCommonResolver],
})
export class ContentCommonModule {}
