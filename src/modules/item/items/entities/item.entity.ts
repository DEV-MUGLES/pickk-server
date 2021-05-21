import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator';

import { BaseIdEntity } from '@src/common/entities/base.entity';

import { BrandEntity } from '../../brands/entities/brand.entity';
import { Brand } from '../../brands/models/brand.model';
import { ItemCategory } from '../../item-categories/models/item-category.model';
import { ItemCategoryEntity } from '../../item-categories/entities/item-category.entity';
import { Product } from '../../products/models/product.model';

import { IItem } from '../interfaces/item.interface';
import { ItemUrl } from '../models/item-url.model';
import { ItemDetailImage } from '../models/item-detail-image.model';
import { ItemOption } from '../models/item-option.model';
import { ItemSalePolicy } from '../models/item-sale-policy.model';
import { ItemPrice } from '../models/item-price.model';
import { ItemNotice } from '../models/item-notice.model';

import { ItemSalePolicyEntity } from './item-sale-policy.entity';
import { ItemNoticeEntity } from './item-notice.entity';
import { Optional } from '@nestjs/common';

@ObjectType()
@Entity({
  name: 'item',
})
@Index(['providedCode'])
export class ItemEntity extends BaseIdEntity implements IItem {
  constructor(attributes?: Partial<ItemEntity>) {
    super();
    if (!attributes) {
      return;
    }

    this.name = attributes.name;
    this.providedCode = attributes.providedCode;
    this.imageUrl = attributes.imageUrl;

    this.isInfiniteStock = attributes.isInfiniteStock;
    this.isSoldout = attributes.isSoldout;
    this.isMdRecommended = attributes.isMdRecommended;
    this.isSellable = attributes.isSellable;
    this.isPurchasable = attributes.isPurchasable;

    this.brand = attributes.brand;
    this.brandId = attributes.brandId;
    this.notice = attributes.notice;

    this.prices = attributes.prices;
    this.urls = attributes.urls;
    this.detailImages = attributes.detailImages;
    this.options = attributes.options;
    this.products = attributes.products;
    this.majorCategory = attributes.majorCategory;
    this.minorCategory = attributes.minorCategory;
    this.majorCategoryId = attributes.majorCategoryId;
    this.minorCategoryId = attributes.minorCategoryId;

    this.sellableAt = attributes.sellableAt;
  }

  @Field()
  @Column()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  providedCode?: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @Field()
  @Column()
  @IsUrl()
  imageUrl: string;

  @Field({ defaultValue: true })
  @Column({
    default: true,
  })
  @IsBoolean()
  @Optional()
  isInfiniteStock: boolean;

  @Field({ defaultValue: false })
  @Column({
    default: false,
  })
  @IsBoolean()
  @Optional()
  isSoldout: boolean;

  @Field({ defaultValue: true })
  @Column({
    default: true,
  })
  @IsBoolean()
  @Optional()
  isMdRecommended: boolean;

  @Field({ defaultValue: false })
  @Column({
    default: false,
  })
  @IsBoolean()
  @Optional()
  isSellable: boolean;

  @Field({ defaultValue: false })
  @Column({
    default: false,
  })
  @IsBoolean()
  @Optional()
  isPurchasable: boolean;

  @Field(() => Brand)
  @ManyToOne(() => BrandEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  brand: Brand;

  @Field(() => Int)
  @Column()
  brandId: number;

  @OneToMany('ItemPriceEntity', 'item', {
    cascade: true,
    eager: true,
  })
  prices: ItemPrice[];

  @OneToMany('ItemUrlEntity', 'item', {
    cascade: true,
  })
  urls: ItemUrl[];

  @OneToMany('ItemDetailImageEntity', 'item', {
    cascade: true,
  })
  detailImages: ItemDetailImage[];

  @OneToMany('ItemOptionEntity', 'item', {
    cascade: true,
  })
  options: ItemOption[];

  @Field(() => ItemSalePolicy, {
    nullable: true,
  })
  @OneToOne(() => ItemSalePolicyEntity, { cascade: true, nullable: true })
  @JoinColumn()
  salePolicy: ItemSalePolicy;

  @OneToMany('ProductEntity', 'item', {
    cascade: true,
  })
  products: Product[];

  @Field({
    nullable: true,
  })
  @Column({
    type: 'int',
    nullable: true,
  })
  majorCategoryId?: number;

  @Field({
    nullable: true,
  })
  @Column({
    type: 'int',
    nullable: true,
  })
  minorCategoryId?: number;

  @Field(() => ItemCategory, {
    nullable: true,
  })
  @ManyToOne(() => ItemCategoryEntity, {
    nullable: true,
  })
  @JoinColumn()
  majorCategory?: ItemCategory;

  @Field(() => ItemCategory, {
    nullable: true,
  })
  @ManyToOne(() => ItemCategoryEntity, {
    nullable: true,
  })
  @JoinColumn()
  minorCategory?: ItemCategory;

  @Field(() => ItemNotice, {
    nullable: true,
    description: '상품 안내 메세지입니다. 파트너어드민에서 입력할 수 있습니다.',
  })
  @OneToOne(() => ItemNoticeEntity, { cascade: true, nullable: true })
  @JoinColumn()
  notice: ItemNotice;

  @Field({ nullable: true, description: '판매가능시점(=활성전환일)' })
  @Column({ nullable: true })
  sellableAt?: Date;

  @BeforeInsert()
  @BeforeUpdate()
  setSellableAt() {
    if (this.isSellable && !this.sellableAt) {
      this.sellableAt = new Date();
    }
  }
}
