import { Field, ObjectType } from '@nestjs/graphql';

import { ItemSizeChartColumnName } from '../constants/item-size-chart.enum';
import { ItemSizeChartEntity } from '../entities/item-size-chart.entity';
import { IItemSizeChartMetaData } from '../interfaces/item-size-chart.interface';

@ObjectType()
export class ItemSizeChart extends ItemSizeChartEntity {}

@ObjectType()
export class ItemSizeChartMetaData implements IItemSizeChartMetaData {
  constructor(attributes: IItemSizeChartMetaData) {
    this.columnName = attributes.columnName;
    this.displayName = attributes.displayName;
  }

  @Field()
  columnName: ItemSizeChartColumnName;

  @Field()
  displayName: string;
}
