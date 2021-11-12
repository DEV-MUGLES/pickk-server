import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { YoutubeProviderService } from './provider.service';

@Module({
  imports: [HttpModule],
  providers: [YoutubeProviderService],
  exports: [YoutubeProviderService],
})
export class YoutubeProviderModule {}
