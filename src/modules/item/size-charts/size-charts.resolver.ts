import { Inject } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';

import { BaseResolver } from '@src/common/base.resolver';
import { SizeChart } from './model/size-chart.model';
import { SizeChartsService } from './size-charts.service';

@Resolver(() => SizeChart)
export class SizeChartsResolver extends BaseResolver {
  constructor(
    @Inject(SizeChartsService) private sizeChartsService: SizeChartsService
  ) {
    super();
  }
}
