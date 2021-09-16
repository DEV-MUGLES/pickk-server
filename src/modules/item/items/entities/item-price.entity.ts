import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IsEnum, IsOptional } from 'class-validator';

import { BaseIdEntity } from '@common/entities';

import { ItemPriceUnit } from '../constants';
import { IItem, IItemPrice } from '../interfaces';

@ObjectType()
@Entity('item_price')
export class ItemPriceEntity extends BaseIdEntity implements IItemPrice {
  constructor(attributes?: Partial<ItemPriceEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.item = attributes.item;
    this.itemId = attributes.itemId;

    this.originalPrice = attributes.originalPrice;
    this.sellPrice = attributes.sellPrice;
    this.finalPrice = (() => {
      const {
        sellPrice,
        pickkDiscountAmount: amount,
        pickkDiscountRate: rate,
      } = attributes;

      return amount
        ? sellPrice - amount
        : Math.floor((sellPrice * (100 - (rate ?? 5))) / 100);
    })();

    this.pickkDiscountAmount = attributes.pickkDiscountAmount;
    this.pickkDiscountRate = attributes.pickkDiscountRate ?? 5;

    this.isActive = attributes.isActive ?? false;
    this.isCrawlUpdating = attributes.isCrawlUpdating;
    this.isBase = attributes.isBase ?? false;

    this.startAt = attributes.startAt;
    this.endAt = attributes.endAt;

    this.displayPrice = attributes.displayPrice;
    this.unit = attributes.unit;
  }

  @ManyToOne('ItemEntity', 'prices', { onDelete: 'CASCADE' })
  item: IItem;
  @Field(() => Int)
  @Column()
  itemId: number;

  @Field(() => Int)
  @Column({ type: 'mediumint', unsigned: true })
  originalPrice: number;
  @Field(() => Int)
  @Column({ type: 'mediumint', unsigned: true })
  sellPrice: number;
  @Field(() => Int)
  @Column({ type: 'mediumint', unsigned: true })
  finalPrice: number;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'mediumint', unsigned: true, nullable: true })
  pickkDiscountAmount?: number;
  @Field(() => Int)
  @Column({ type: 'float', default: 5 })
  pickkDiscountRate?: number;

  @Field()
  @Column()
  isActive: boolean;
  @Field()
  @Column()
  isCrawlUpdating: boolean;
  @Field()
  @Column()
  isBase: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  startAt?: Date;
  @Field({ nullable: true })
  @Column({ nullable: true })
  endAt?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  displayPrice?: number;
  @Field(() => ItemPriceUnit, { nullable: true })
  @Column({ type: 'enum', enum: ItemPriceUnit, default: ItemPriceUnit.KRW })
  @IsEnum(ItemPriceUnit)
  @IsOptional()
  unit?: ItemPriceUnit;
}
