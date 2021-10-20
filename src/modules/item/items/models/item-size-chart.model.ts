import { Field, ObjectType } from '@nestjs/graphql';

import { ItemSizeChartColumnName } from '../constants';
import { ItemSizeChartEntity } from '../entities';
import { IItemSizeChartMetaData } from '../interfaces';

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
