import { ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';

import { BaseIdEntity } from '@common/entities';

import { IItemSizeChart } from '../interfaces';

@ObjectType()
@Entity({ name: 'item_size_chart' })
export class ItemSizeChartEntity extends BaseIdEntity
  implements IItemSizeChart {
  constructor(attributes?: Partial<ItemSizeChartEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }
    this.serializedLabels = attributes.serializedLabels;
    this.serializedSizes = attributes.serializedSizes;
    this.serializedRecommedations = attributes.serializedRecommedations;
  }

  @Column()
  serializedLabels: string;
  @Column()
  serializedSizes: string;
  @Column({ nullable: true })
  serializedRecommedations: string;
}
