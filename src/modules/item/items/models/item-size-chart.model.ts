import { ObjectType } from '@nestjs/graphql';
import { AddItemSizeChartInput } from '../dtos/item-size-chart.input';

import { ItemSizeChartEntity } from '../entities/item-size-chart.entity';

@ObjectType()
export class ItemSizeChart extends ItemSizeChartEntity {
  public update = (addItemSizeChartInput: AddItemSizeChartInput) => {
    for (const [key, value] of Object.entries(addItemSizeChartInput)) {
      this[key] = value;
    }
  };
}
