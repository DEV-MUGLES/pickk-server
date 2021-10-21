import { ObjectType } from '@nestjs/graphql';

import { ItemSizeChartEntity } from '../entities';

@ObjectType()
export class ItemSizeChart extends ItemSizeChartEntity {}
