import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Tree, Column, TreeChildren, TreeParent } from 'typeorm';

import { BaseIdEntity } from '@src/common/entities/base.entity';

import { IItemCategory } from '../interfaces/item-category.interface';

@ObjectType()
@Entity({ name: 'item_category' })
@Tree('nested-set')
export class ItemCategoryEntity extends BaseIdEntity implements IItemCategory {
  @Column({
    type: 'varchar',
    length: 10,
    unique: true,
  })
  @Field()
  name: string;

  @Column({
    type: 'varchar',
    length: 10,
    unique: true,
  })
  @Field()
  code: string;

  @TreeChildren()
  children: ItemCategoryEntity[];

  @TreeParent()
  parent: ItemCategoryEntity;
}
