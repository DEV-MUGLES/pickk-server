import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { IsNumber, IsString } from 'class-validator';

import { BaseIdEntity } from '@common/entities';

import { ItemCategory } from '@item/item-categories/models';

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

  @Field()
  @Column({ length: 20 })
  @IsString()
  name: string;

  @Field(() => ItemCategory)
  @ManyToOne('ItemCategoryEntity')
  minorCategory: ItemCategory;

  @Field(() => Int)
  @Column()
  @IsNumber()
  minorCategoryId: number;

  @OneToMany('ItemPropertyValueEntity', 'itemProperty', {
    cascade: true,
  })
  values: ItemPropertyValue[];
}
