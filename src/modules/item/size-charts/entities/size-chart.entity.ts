import { Column, Entity, ManyToOne } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';

import { BaseIdEntity } from '@src/common/entities/base.entity';
import { ISizeChart } from '../interfaces/size-chart.interface';
import { FloatColumn } from '../decorators/size-chart.decorator';
import { ItemEntity } from '../../items/entities/item.entity';

@ObjectType()
@Entity({
  name: 'size_chart',
})
export class SizeChartEntity extends BaseIdEntity implements ISizeChart {
  constructor(attributes?: Partial<SizeChartEntity>) {
    super();
    if (!attributes) return;
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
  /**
   * XS,S,M,L,XL등 사이즈 값들의 집합의 이름을 의미한다.
   */
  @Column()
  name: string;
  /**
   * 총장을 의미한다.
   */
  @Field()
  @FloatColumn()
  totalLength?: number;
  /**
   * 어깨너비를 의미한다.
   */
  @Field()
  @FloatColumn()
  shoulderWidth?: number;

  /**
   * 가슴단면를 의미한다.
   */
  @Field()
  @FloatColumn()
  chestWidth?: number;

  /**
   * 소매길이를 의미한다.
   */
  @Field()
  @FloatColumn()
  sleeveLength?: number;

  /**
   * 허리단면을 의미한다.
   */
  @Field()
  @FloatColumn()
  waistWidth?: number;

  /**
   * 밑위를 의미한다.
   */
  @Field()
  @FloatColumn()
  riseHeight?: number;

  /**
   * 허벅지 단면을 의미한다.
   */
  @Field()
  @FloatColumn()
  thighWidth?: number;

  /**
   * 밑단단면을 의미한다.
   */
  @Field()
  @FloatColumn()
  hemWidth?: number;

  /**
   * 악세사리류에 해당하는 너비(가로)를 의미한다.
   * 시계케이스가로, 가방너비, 벨트버클가로, 안경렌즈너비, 지갑가로
   */
  @Field()
  @FloatColumn()
  accWidth?: number;

  /**
   * 악세사리류에 해당하는 높이(세로)를 의미한다.
   * 시계케이스세로, 가방높이, 벨트버클세로, 안경렌즈높이, 지갑세로
   */
  @Field()
  @FloatColumn()
  accHeight?: number;

  /**
   * 악세사리류에 해당하는 폭을 의미한다.
   * 시계케이스폭, 가방폭, 지갑폭등등
   */
  @Field()
  @FloatColumn()
  accDepth?: number;

  /**
   * 가방끈의 길이를 의미한다.
   */
  @Field()
  @FloatColumn()
  crossStrapLength?: number;

  /**
   * 시계 밴드폭을 의미한다.
   */
  @Field()
  @FloatColumn()
  watchBandDepth?: number;

  /**
   * 안경전체 너비를 의미한다.
   */
  @Field()
  @FloatColumn()
  glassWidth?: number;

  /**
   * 안경브릿지의 길이를 의미한다.
   */
  @Field()
  @FloatColumn()
  glassBridgeLength?: number;
  /**
   * 안경다리길이를 의미한다.
   */
  @Field()
  @FloatColumn()
  glassLegLength?: number;

  @Field(() => Int)
  @Column({
    type: 'int',
  })
  itemId: number;

  @ManyToOne('ItemEntity', 'sizeCharts', {
    onDelete: 'CASCADE',
  })
  item: ItemEntity;
}
