import { ObjectType } from '@nestjs/graphql';

import { SizeChartEntity } from '../entities/size-chart.entity';

@ObjectType()
export class SizeChart extends SizeChartEntity {}
