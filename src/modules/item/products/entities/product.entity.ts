import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '@src/common/entities/base.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

import { IProduct } from '../interfaces/product.interface';
import { ItemEntity } from '../../items/entities/item.entity';
import { ItemOptionValue } from '../../items/models/item-option-value.model';
import { ItemOptionValueEntity } from '../../items/entities/item-option-value.entity';

@ObjectType()
@Entity({
  name: 'product',
})
export class ProductEntity extends BaseEntity implements IProduct {
  @Field(() => Int)
  @Column({
    type: 'smallint',
    unsigned: true,
    default: 0,
  })
  stock: number;

  @ManyToOne('ItemEntity', 'products', {
    onDelete: 'CASCADE',
  })
  item: ItemEntity;

  @Field(() => [ItemOptionValue])
  @ManyToMany(() => ItemOptionValueEntity)
  @JoinTable()
  itemOptionValues: ItemOptionValue[];
}
