import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IsOptional, Max, Min } from 'class-validator';

import { BaseEntity } from '@src/common/entities/base.entity';

import { IItemOptionValue } from '../interfaces/item-option-value.interface';
import { ItemOptionEntity } from './item-option.entity';

@ObjectType()
@Entity({ name: 'item_option_value' })
export class ItemOptionValueEntity
  extends BaseEntity
  implements IItemOptionValue {
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

  @ManyToOne('ItemOptionEntity', 'values', {
    onDelete: 'CASCADE',
  })
  item: ItemOptionEntity;
}
