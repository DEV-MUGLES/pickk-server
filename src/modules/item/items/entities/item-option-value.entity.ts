import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IsOptional, Max, Min } from 'class-validator';

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

    this.name = attributes.name;
    this.priceVariant = attributes.priceVariant;
    this.order = attributes.order;
    this.itemOption = attributes.itemOption;
  }

  @Field()
  @Column()
  name: string;
  @Field(() => Int)
  @Column({ type: 'mediumint', unsigned: true })
  priceVariant: number;
  @Field()
  @Column({
    type: 'tinyint',
    unsigned: true,
    default: 0,
  })
  @IsOptional()
  @Min(0)
  @Max(255)
  order: number;

  @ManyToOne('ItemOptionEntity', 'values', {
    onDelete: 'CASCADE',
  })
  itemOption: ItemOptionEntity;
}
