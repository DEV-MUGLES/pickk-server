import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { IsOptional, Max, Min } from 'class-validator';

import { BaseIdEntity } from '@src/common/entities/base.entity';

import { IItemOption } from '../interfaces/item-option.interface';
import { ItemOptionValue } from '../models/item-option-value.model';
import { IItem } from '../interfaces/item.interface';

@ObjectType()
@Entity({ name: 'item_option' })
export class ItemOptionEntity extends BaseIdEntity implements IItemOption {
  constructor(attributes?: Partial<ItemOptionEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.name = attributes.name;
    this.order = attributes.order;
    this.values = attributes.values;
    this.item = attributes.item;
  }

  @Field()
  @Column({
    type: 'varchar',
    length: 20,
  })
  name: string;

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

  @OneToMany('ItemOptionValueEntity', 'itemOption', {
    cascade: true,
  })
  values: ItemOptionValue[];

  @ManyToOne('ItemEntity', 'options', {
    onDelete: 'CASCADE',
  })
  item: IItem;
}
