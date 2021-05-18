import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SizeChartsRepository } from './size-charts.repository';
import { SizeChartsResolver } from './size-charts.resolver';
import { SizeChartsService } from './size-charts.service';

@Module({
  imports: [TypeOrmModule.forFeature([SizeChartsRepository])],
  providers: [SizeChartsService, SizeChartsResolver],
})
export class SizeChartsModule {}
