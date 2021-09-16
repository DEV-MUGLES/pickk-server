import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IsBoolean, IsUrl } from 'class-validator';

import { BaseIdEntity } from '@common/entities';

import { IItemUrl } from '../interfaces';
import { ItemEntity } from './item.entity';

@ObjectType()
@Entity('item_url')
export class ItemUrlEntity extends BaseIdEntity implements IItemUrl {
  constructor(attributes?: Partial<ItemUrlEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.item = attributes.item;
    this.itemId = attributes.itemId;

    this.url = attributes.url;
    this.isPrimary = attributes.isPrimary;
    this.isAvailable = attributes.isAvailable;
  }

  @ManyToOne('ItemEntity', 'urls', { onDelete: 'CASCADE' })
  item: ItemEntity;
  @Field(() => Int)
  @Column()
  itemId: number;

  @Field()
  @Column()
  @IsUrl()
  url: string;
  @Field()
  @Column({ default: false })
  @IsBoolean()
  isPrimary: boolean;

  @Field()
  @Column({ default: true })
  @IsBoolean()
  isAvailable: boolean;
}
