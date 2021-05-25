import { ObjectType } from '@nestjs/graphql';

import { ItemSizeChartEntity } from '../entities/item-size-chart.entity';

@ObjectType()
export class ItemSizeChart extends ItemSizeChartEntity {}
