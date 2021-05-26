import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

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

    this.pickkDiscountAmount = attributes.pickkDiscountAmount;
    this.pickkDiscountRate = attributes.pickkDiscountRate || 5;

    this.finalPrice = this.pickkDiscountAmount
      ? this.sellPrice - this.pickkDiscountAmount
      : Math.floor((this.sellPrice * (100 - this.pickkDiscountRate)) / 100);

    this.isActive = attributes.isActive || false;
    this.isCrawlUpdating = attributes.isCrawlUpdating;
    this.isBase = attributes.isBase || false;

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
  @IsOptional()
  finalPrice: number;

  @Field(() => Int, { nullable: true })
  @Column({
    type: 'mediumint',
    unsigned: true,
    nullable: true,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  pickkDiscountAmount?: number;

  @Field(() => Int, { nullable: true })
  @Column({
    type: 'mediumint',
    unsigned: true,
    nullable: true,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  pickkDiscountRate?: number;

  @Field()
  @Column()
  @IsBoolean()
  isActive: boolean;

  @Field()
  @Column()
  @IsBoolean()
  isCrawlUpdating: boolean;

  @Field()
  @Column()
  @IsBoolean()
  @IsOptional()
  isBase: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsDate()
  @IsOptional()
  startAt?: Date | null;

  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsDate()
  @IsOptional()
  endAt?: Date | null;

  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsNumber()
  @IsOptional()
  displayPrice?: number | null;

  @Field(() => ItemPriceUnit, { nullable: true })
  @Column({
    type: 'enum',
    enum: ItemPriceUnit,
    default: ItemPriceUnit.KRW,
  })
  @IsEnum(ItemPriceUnit)
  @IsOptional()
  unit?: ItemPriceUnit;

  @ManyToOne('ItemEntity', 'prices', {
    onDelete: 'CASCADE',
  })
  item: ItemEntity;

  @Field(() => Int)
  @Column()
  itemId: number;
}
