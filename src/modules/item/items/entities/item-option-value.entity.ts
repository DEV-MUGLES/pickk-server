import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseIdEntity } from '@common/entities';

import { IItemOptionValue } from '../interfaces';
import { ItemOptionEntity } from './item-option.entity';

@ObjectType()
@Entity({ name: 'item_option_value' })
export class ItemOptionValueEntity
  extends BaseIdEntity
  implements IItemOptionValue
{
  constructor(attributes?: Partial<ItemOptionValueEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.itemOption = attributes.itemOption;
    this.itemOptionId = attributes.itemOptionId;

    this.name = attributes.name;
    this.priceVariant = attributes.priceVariant;
    this.order = attributes.order;
  }

  @ManyToOne('ItemOptionEntity', 'values', { onDelete: 'CASCADE' })
  @JoinColumn()
  itemOption: ItemOptionEntity;
  @Field(() => Int)
  @Column()
  itemOptionId: number;

  @Field()
  @Column()
  name: string;
  @Field(() => Int)
  @Column({ type: 'mediumint', unsigned: true })
  priceVariant: number;
  @Field()
  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  order: number;
}
