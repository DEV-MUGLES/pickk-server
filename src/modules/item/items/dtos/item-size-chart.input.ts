import { Field, InputType, Int, PickType } from '@nestjs/graphql';

import { ItemSizeChart } from '../models';

@InputType()
export class AddItemSizeChartInput extends PickType(
  ItemSizeChart,
  [
    'accDepth',
    'accHeight',
    'accWidth',
    'chestWidth',
    'crossStrapLength',
    'glassBridgeLength',
    'glassLegLength',
    'glassWidth',
    'hemWidth',
    'name',
    'riseHeight',
    'shoulderWidth',
    'sleeveLength',
    'thighWidth',
    'totalLength',
    'waistWidth',
    'watchBandDepth',
  ],
  InputType
) {}

@InputType()
export class UpdateItemSizeChartInput extends AddItemSizeChartInput {
  @Field(() => Int, { nullable: true })
  id?: number;
}
