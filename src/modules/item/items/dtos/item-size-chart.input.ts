import { Field, InputType, Int, OmitType, PickType } from '@nestjs/graphql';
import { ItemSizeChart } from '../models/item-size-chart.model';

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
export class UpdateItemSizeChartInput extends OmitType(
  AddItemSizeChartInput,
  ['name'],
  InputType
) {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field({ nullable: true })
  name?: string;
}
