import { Field, ObjectType } from '@nestjs/graphql';
import { BaseIdEntity } from '@src/common/entities/base.entity';
import { Entity, Tree, Column, TreeChildren, TreeParent } from 'typeorm';

import { IItemCategory } from '../interfaces/item-category.interface';

@ObjectType()
@Entity({ name: 'item_category' })
@Tree('nested-set')
export class ItemCategoryEntity extends BaseIdEntity implements IItemCategory {
  constructor(attributes?: Partial<ItemCategoryEntity>) {
    super(attributes);
    if (!attributes) return;

    this.name = attributes.name;
    this.code = attributes.code;
    this.parent = attributes.parent;
    this.children = attributes.children;
  }
  @Column({
    type: 'varchar',
    length: 20,
    unique: true,
  })
  @Field()
  code: string;

  @Column({
    type: 'varchar',
    length: 20,
  })
  @Field()
  name: string;

  @TreeChildren()
  children: ItemCategoryEntity[];

  @TreeParent()
  parent: ItemCategoryEntity;
}
