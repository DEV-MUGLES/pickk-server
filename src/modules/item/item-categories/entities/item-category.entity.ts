import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Tree, Column, TreeChildren, TreeParent } from 'typeorm';

import { BaseIdEntity } from '@common/entities';

import { IItemCategory } from '../interfaces';

@ObjectType()
@Entity({ name: 'item_category' })
@Tree('nested-set')
export class ItemCategoryEntity extends BaseIdEntity implements IItemCategory {
  constructor(attributes?: Partial<ItemCategoryEntity>) {
    super(attributes);
    if (!attributes) return;

    this.parent = attributes.parent;
    this.children = attributes.children;

    this.name = attributes.name;
    this.code = attributes.code;
  }

  @TreeParent({ onDelete: 'CASCADE' })
  parent: ItemCategoryEntity;
  @TreeChildren()
  children: ItemCategoryEntity[];

  @Field({ description: '최대 20자' })
  @Column({ length: 20, unique: true })
  code: string;
  @Field({ description: '최대 20자' })
  @Column({ length: 20 })
  name: string;

  @Column({ nullable: true })
  oldItemMajorTypeId: number;
  @Column({ nullable: true })
  oldItemMinorTypeId: number;
}
