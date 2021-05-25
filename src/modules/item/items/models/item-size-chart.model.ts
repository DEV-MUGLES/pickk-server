import { ObjectType } from '@nestjs/graphql';
import { UpdateItemSizeChartInput } from '../dtos/item-size-chart.input';

import { ItemSizeChartEntity } from '../entities/item-size-chart.entity';

@ObjectType()
export class ItemSizeChart extends ItemSizeChartEntity {
  public update = (updateItemSizeChartInput: UpdateItemSizeChartInput) => {
    if (!updateItemSizeChartInput) return;
    for (const [key, value] of Object.entries(updateItemSizeChartInput)) {
      this[key] = value;
    }
  };
}
