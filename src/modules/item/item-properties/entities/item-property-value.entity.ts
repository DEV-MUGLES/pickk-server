import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

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

    this.property = attributes.property;

    this.name = attributes.name;
    this.order = attributes.order;
  }

  @ManyToOne('ItemPropertyEntity', 'values', {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  property: ItemPropertyEntity;
  @Field(() => Int)
  @Column()
  propertyId: number;

  @Field()
  @Column({ length: 20 })
  name: string;
  @Field({ description: '표시될 순서. 최소 0, 최대 255입니다.' })
  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  order: number;
}
