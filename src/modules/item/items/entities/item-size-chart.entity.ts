import { Column, Entity, ManyToOne } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';

import { BaseIdEntity } from '@common/entities';

import { IItemSizeChart } from '../interfaces';
import { ItemEntity } from './item.entity';

const NullableFloatColumn = () =>
  Column({ type: 'float', default: null, nullable: true });

@ObjectType()
@Entity({
  name: 'item_size_chart',
})
export class ItemSizeChartEntity
  extends BaseIdEntity
  implements IItemSizeChart
{
  constructor(attributes?: Partial<ItemSizeChartEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }
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

    this.itemId = attributes.itemId;
    this.item = attributes.item;
  }

  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @NullableFloatColumn()
  totalLength?: number;

  @Field({ nullable: true })
  @NullableFloatColumn()
  shoulderWidth?: number;

  @Field({ nullable: true })
  @NullableFloatColumn()
  chestWidth?: number;

  @Field({ nullable: true })
  @NullableFloatColumn()
  sleeveLength?: number;

  @Field({ nullable: true })
  @NullableFloatColumn()
  waistWidth?: number;

  @Field({ nullable: true })
  @NullableFloatColumn()
  riseHeight?: number;

  @Field({ nullable: true })
  @NullableFloatColumn()
  thighWidth?: number;

  @Field({ nullable: true })
  @NullableFloatColumn()
  hemWidth?: number;

  @Field({ nullable: true })
  @NullableFloatColumn()
  accWidth?: number;

  @Field({ nullable: true })
  @NullableFloatColumn()
  accHeight?: number;

  @Field({ nullable: true })
  @NullableFloatColumn()
  accDepth?: number;

  @Field({ nullable: true })
  @NullableFloatColumn()
  crossStrapLength?: number;

  @Field({ nullable: true })
  @NullableFloatColumn()
  watchBandDepth?: number;

  @Field({ nullable: true })
  @NullableFloatColumn()
  glassWidth?: number;

  @Field({ nullable: true })
  @NullableFloatColumn()
  glassBridgeLength?: number;

  @Field({ nullable: true })
  @NullableFloatColumn()
  glassLegLength?: number;

  @Field(() => Int)
  @Column()
  itemId: number;

  @ManyToOne('ItemEntity', 'sizeCharts', {
    onDelete: 'CASCADE',
  })
  item: ItemEntity;
}
