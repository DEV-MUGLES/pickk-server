import { Column, Entity, ManyToOne } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';

import { BaseIdEntity } from '@common/entities';

import {
  IItemSize,
  IItemSizeChart,
  IItemSizeRecommendation,
} from '../interfaces';

@ObjectType()
@Entity({ name: 'item_size_chart' })
export class ItemSizeChartEntity extends BaseIdEntity
  implements IItemSizeChart {
  constructor(attributes?: Partial<ItemSizeChartEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.labels = attributes.labels;
    this.sizes = attributes.sizes;
    this.recommendations = attributes.recommendations;
  }

  @Column({
    type: 'json',
  })
  labels: string[];
  @Column({
    type: 'json',
  })
  sizes: IItemSize[];
  @Column({ type: 'json', nullable: true })
  recommendations: IItemSizeRecommendation[];
}
