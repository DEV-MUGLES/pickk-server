import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { IsNumber, Min } from 'class-validator';

import { BaseIdEntity } from '@src/common/entities/base.entity';

import { ItemEntity } from './item.entity';
import { IItemPrice } from '../interfaces/item-price.interface';
import { ItemPriceUnit } from '../constants/item-price.enum';

@ObjectType()
@Entity('item_price')
@Index('idx_sellPrice', ['sellPrice'])
export class ItemPriceEntity extends BaseIdEntity implements IItemPrice {
  constructor(attributes?: Partial<ItemPriceEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.originalPrice = attributes.originalPrice;
    this.sellPrice = attributes.sellPrice;
    this.finalPrice = attributes.finalPrice;

    this.pickkDiscountAmount = attributes.pickkDiscountAmount;
    this.pickkDiscountRate = attributes.pickkDiscountRate;

    this.isActive = attributes.isActive;
    this.isCrawlUpdating = attributes.isCrawlUpdating;
    this.isBase = attributes.isBase;

    this.startAt = attributes.startAt;
    this.endAt = attributes.endAt;

    this.displayPrice = attributes.displayPrice;
    this.unit = attributes.unit;

    this.item = attributes.item;
    this.itemId = attributes.itemId;
  }

  @Field(() => Int)
  @Column({
    type: 'mediumint',
    unsigned: true,
  })
  @IsNumber()
  @Min(1)
  originalPrice: number;

  @Field(() => Int)
  @Column({
    type: 'mediumint',
    unsigned: true,
  })
  @IsNumber()
  @Min(1)
  sellPrice: number;

  @Field(() => Int)
  @Column({
    type: 'mediumint',
    unsigned: true,
  })
  @IsNumber()
  @Min(1)
  finalPrice: number;

  @Field(() => Int)
  @Column({
    type: 'mediumint',
    unsigned: true,
  })
  @IsNumber()
  @Min(1)
  pickkDiscountAmount?: number;

  @Field(() => Int)
  @Column({
    type: 'mediumint',
    unsigned: true,
  })
  @IsNumber()
  @Min(1)
  pickkDiscountRate?: number;

  isActive: boolean;
  isCrawlUpdating: boolean;
  isBase: boolean;

  startAt?: Date | null;
  endAt?: Date | null;

  displayPrice?: number | null;
  unit?: ItemPriceUnit;

  @ManyToOne('ItemEntity', 'prices', {
    onDelete: 'CASCADE',
  })
  item: ItemEntity;

  @Field(() => Int)
  @Column()
  itemId: number;
}
