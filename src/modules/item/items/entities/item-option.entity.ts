import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { BaseIdEntity } from '@common/entities';

import { IItem, IItemOption } from '../interfaces';
import { ItemOptionValue } from '../models';

@ObjectType()
@Entity({ name: 'item_option' })
export class ItemOptionEntity extends BaseIdEntity implements IItemOption {
  constructor(attributes?: Partial<ItemOptionEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.item = attributes.item;
    this.itemId = attributes.itemId;

    this.values = attributes.values;

    this.name = attributes.name;
    this.order = attributes.order;
  }

  @ManyToOne('ItemEntity', 'options', {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  item: IItem;
  @Field(() => Int)
  @Column()
  itemId: number;

  @OneToMany('ItemOptionValueEntity', 'itemOption', { cascade: true })
  values: ItemOptionValue[];

  @Field()
  @Column({ length: 25 })
  name: string;
  @Field()
  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  order: number;
}
