import { InputType, PickType } from '@nestjs/graphql';

import { ItemSizeChart } from '../models';

@InputType()
export class CreateItemSizeChartInput extends PickType(
  ItemSizeChart,
  ['labels', 'recommendations', 'sizes'],
  InputType
) {}

@InputType()
export class UpdateItemSizeChartInput extends CreateItemSizeChartInput {}
