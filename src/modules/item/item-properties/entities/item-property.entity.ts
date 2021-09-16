import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { BaseIdEntity } from '@common/entities';

import { IItemCategory } from '@item/item-categories/interfaces';

import { IItemProperty } from '../interfaces';
import { ItemPropertyValue } from '../models';

@ObjectType()
@Entity({ name: 'item_property' })
export class ItemPropertyEntity extends BaseIdEntity implements IItemProperty {
  constructor(attributes?: Partial<ItemPropertyEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.name = attributes.name;
    this.minorCategory = attributes.minorCategory;
    this.minorCategoryId = attributes.minorCategoryId;
    this.values = attributes.values;
  }

  @ManyToOne('ItemCategoryEntity', { onDelete: 'CASCADE' })
  minorCategory: IItemCategory;
  @Field(() => Int)
  @Column()
  minorCategoryId: number;

  @OneToMany('ItemPropertyValueEntity', 'property', { cascade: true })
  values: ItemPropertyValue[];

  @Field()
  @Column({ length: 20 })
  name: string;
}
