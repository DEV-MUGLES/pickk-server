import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { CrawlerConfigModule } from '@config/providers/crawler/config.module';

import { CrawlerProviderService } from '.';

@Module({
  imports: [CrawlerConfigModule, HttpModule],
  providers: [CrawlerProviderService],
  exports: [CrawlerProviderService],
})
export class CrawlerProviderModule {}
