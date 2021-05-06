import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  Tree,
  Column,
  TreeChildren,
  TreeParent,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

import { IItemCategory } from '../interfaces/item-category.interface';

@ObjectType()
@Entity({ name: 'item_category' })
@Tree('nested-set')
export class ItemCategoryEntity implements IItemCategory {
  @PrimaryColumn({
    type: 'varchar',
    length: 10,
    unique: true,
  })
  @Field()
  code: string;

  @Column({
    type: 'varchar',
    length: 10,
    unique: true,
  })
  @Field()
  name: string;

  @TreeChildren()
  children: ItemCategoryEntity[];

  @TreeParent()
  parent: ItemCategoryEntity;

  @Field()
  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt: Date;
}
