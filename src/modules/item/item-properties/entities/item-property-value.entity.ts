import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IsOptional, Max, Min } from 'class-validator';

import { BaseIdEntity } from '@common/entities';

import { IItemPropertyValue } from '../interfaces';

import { ItemPropertyEntity } from './item-property.entity';

@ObjectType()
@Entity({ name: 'item_property_value' })
export class ItemPropertyValueEntity
  extends BaseIdEntity
  implements IItemPropertyValue
{
  constructor(attributes?: Partial<ItemPropertyValueEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.name = attributes.name;
    this.order = attributes.order;

    this.property = attributes.property;
  }

  @Field()
  @Column({
    type: 'varchar',
    length: 20,
  })
  name: string;

  @Field({ description: '표시될 순서. 최소 0, 최대 255입니다.' })
  @Column({
    type: 'tinyint',
    unsigned: true,
    default: 0,
  })
  @IsOptional()
  @Min(0)
  @Max(255)
  order: number;

  @ManyToOne('ItemPropertyEntity', 'values', {
    onDelete: 'CASCADE',
  })
  property: ItemPropertyEntity;
}
