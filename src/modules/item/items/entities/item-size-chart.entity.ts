import { Column, Entity, ManyToOne } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';

import { BaseIdEntity } from '@common/entities';

import { IItem, IItemSizeChart } from '../interfaces';

const NullableField = () => Field({ nullable: true });
const NullableFloatColumn = () =>
  Column({ type: 'float', default: null, nullable: true });

@ObjectType()
@Entity({ name: 'item_size_chart' })
export class ItemSizeChartEntity
  extends BaseIdEntity
  implements IItemSizeChart
{
  constructor(attributes?: Partial<ItemSizeChartEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.item = attributes.item;
    this.itemId = attributes.itemId;

    this.name = attributes.name;

    this.totalLength = attributes.totalLength;
    this.shoulderWidth = attributes.shoulderWidth;
    this.chestWidth = attributes.chestWidth;
    this.sleeveLength = attributes.sleeveLength;

    this.waistWidth = attributes.waistWidth;
    this.riseHeight = attributes.riseHeight;
    this.thighWidth = attributes.thighWidth;
    this.hemWidth = attributes.hemWidth;

    this.accWidth = attributes.accWidth;
    this.accHeight = attributes.accHeight;
    this.accDepth = attributes.accDepth;
    this.crossStrapLength = attributes.crossStrapLength;
    this.watchBandDepth = attributes.watchBandDepth;
    this.glassWidth = attributes.glassWidth;
    this.glassBridgeLength = attributes.glassBridgeLength;
    this.glassLegLength = attributes.glassLegLength;
  }

  @ManyToOne('ItemEntity', 'sizeCharts', { onDelete: 'CASCADE' })
  item: IItem;
  @Field(() => Int)
  @Column()
  itemId: number;

  @Field()
  @Column()
  name: string;

  @NullableField()
  @NullableFloatColumn()
  totalLength?: number;
  @NullableField()
  @NullableFloatColumn()
  shoulderWidth?: number;
  @NullableField()
  @NullableFloatColumn()
  chestWidth?: number;
  @NullableField()
  @NullableFloatColumn()
  sleeveLength?: number;

  @NullableField()
  @NullableFloatColumn()
  waistWidth?: number;
  @NullableField()
  @NullableFloatColumn()
  riseHeight?: number;
  @NullableField()
  @NullableFloatColumn()
  thighWidth?: number;
  @NullableField()
  @NullableFloatColumn()
  hemWidth?: number;

  @NullableField()
  @NullableFloatColumn()
  accWidth?: number;
  @NullableField()
  @NullableFloatColumn()
  accHeight?: number;
  @NullableField()
  @NullableFloatColumn()
  accDepth?: number;
  @NullableField()
  @NullableFloatColumn()
  crossStrapLength?: number;
  @NullableField()
  @NullableFloatColumn()
  watchBandDepth?: number;
  @NullableField()
  @NullableFloatColumn()
  glassWidth?: number;
  @NullableField()
  @NullableFloatColumn()
  glassBridgeLength?: number;
  @NullableField()
  @NullableFloatColumn()
  glassLegLength?: number;
}
