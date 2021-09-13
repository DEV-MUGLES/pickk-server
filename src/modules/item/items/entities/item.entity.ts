import { Optional } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator';

import { BaseIdEntity } from '@common/entities';

import { BrandEntity } from '@item/brands/entities';
import { Brand } from '@item/brands/models';
import { ICampaign } from '@item/campaigns/interfaces';
import { ItemCategoryEntity } from '@item/item-categories/entities';
import { ItemCategory } from '@item/item-categories/models';
import { IProduct } from '@item/products/interfaces';

import { IItem, IItemOption } from '../interfaces';

import { ItemNoticeEntity } from './item-notice.entity';
import { ItemSalePolicyEntity } from './item-sale-policy.entity';

import { ItemUrl } from '../models/item-url.model';
import { ItemDetailImage } from '../models/item-detail-image.model';
import { ItemSalePolicy } from '../models/item-sale-policy.model';
import { ItemPrice } from '../models/item-price.model';
import { ItemNotice } from '../models/item-notice.model';
import { ItemSizeChart } from '../models/item-size-chart.model';

@ObjectType()
@Entity({
  name: 'item',
})
@Index('idx_providedCode', ['providedCode'])
@Index('idx_majorCategoryId-code', ['majorCategoryId', 'score'])
@Index('idx_minorCategoryId-code', ['minorCategoryId', 'score'])
export class ItemEntity extends BaseIdEntity implements IItem {
  constructor(attributes?: Partial<ItemEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.brand = attributes.brand;
    this.brandId = attributes.brandId;

    this.options = attributes.options;
    this.products = attributes.products;
    this.campaigns = attributes.campaigns;

    this.majorCategory = attributes.majorCategory;
    this.minorCategory = attributes.minorCategory;
    this.majorCategoryId = attributes.majorCategoryId;
    this.minorCategoryId = attributes.minorCategoryId;

    this.notice = attributes.notice;
    this.salePolicy = attributes.salePolicy;
    this.prices = attributes.prices;
    this.urls = attributes.urls;
    this.detailImages = attributes.detailImages;
    this.sizeCharts = attributes.sizeCharts;

    this.name = attributes.name;
    this.description = attributes.description;
    this.providedCode = attributes.providedCode;
    this.imageUrl = attributes.imageUrl;

    this.isMdRecommended = attributes.isMdRecommended;
    this.isSellable = attributes.isSellable;
    this.isPurchasable = attributes.isPurchasable;
    this.isInfiniteStock = attributes.isInfiniteStock;
    this.isSoldout = attributes.isSoldout;

    this.sellableAt = attributes.sellableAt;

    this.digestAverageRating = attributes.digestAverageRating;
    this.digestCount = attributes.digestCount;
    this.hitCount = attributes.hitCount;
    this.score = attributes.score;
  }

  @Field(() => Brand)
  @ManyToOne(() => BrandEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  brand: Brand;
  @Field(() => Int)
  @Column()
  brandId: number;

  @Field()
  @Column()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @Column({ length: 100, nullable: true })
  @IsString()
  @IsOptional()
  providedCode?: string;

  @Field({ nullable: true })
  @Column({ length: 100, nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field()
  @Column()
  @IsUrl()
  imageUrl: string;

  @Field({ defaultValue: true })
  @Column({ default: true })
  @IsBoolean()
  @Optional()
  isInfiniteStock: boolean;

  @Field({ defaultValue: false })
  @Column({ default: false })
  @IsBoolean()
  @Optional()
  isSoldout: boolean;

  @Field({ defaultValue: true })
  @Column({ default: true })
  @IsBoolean()
  @Optional()
  isMdRecommended: boolean;

  @Field({ defaultValue: false })
  @Column({ default: false })
  @IsBoolean()
  @Optional()
  isSellable: boolean;

  @Field({ defaultValue: false })
  @Column({ default: false })
  @IsBoolean()
  @Optional()
  isPurchasable: boolean;

  @OneToMany('ItemPriceEntity', 'item', { cascade: true, eager: true })
  prices: ItemPrice[];

  @OneToMany('ItemUrlEntity', 'item', { cascade: true })
  urls: ItemUrl[];

  @OneToMany('ItemDetailImageEntity', 'item', { cascade: true })
  detailImages: ItemDetailImage[];

  @OneToMany('ItemOptionEntity', 'item', { cascade: true })
  options: IItemOption[];

  @Field(() => ItemSalePolicy, {
    nullable: true,
  })
  @OneToOne(() => ItemSalePolicyEntity, { cascade: true, nullable: true })
  @JoinColumn()
  salePolicy: ItemSalePolicy;

  @OneToMany('ProductEntity', 'item', { cascade: true })
  products: IProduct[];

  @ManyToMany('CampaignEntity', 'items')
  @JoinTable()
  campaigns: ICampaign[];

  @Field(() => ItemCategory, { nullable: true })
  @ManyToOne(() => ItemCategoryEntity, { nullable: true })
  @JoinColumn()
  majorCategory?: ItemCategory;
  @Field({ nullable: true })
  @Column({ type: 'int', nullable: true })
  majorCategoryId?: number;
  @Field(() => ItemCategory, { nullable: true })
  @ManyToOne(() => ItemCategoryEntity, { nullable: true })
  @JoinColumn()
  minorCategory?: ItemCategory;
  @Field({ nullable: true })
  @Column({ type: 'int', nullable: true })
  minorCategoryId?: number;

  @Field(() => ItemNotice, { nullable: true })
  @OneToOne(() => ItemNoticeEntity, { cascade: true, nullable: true })
  @JoinColumn()
  notice: ItemNotice;

  @OneToMany('ItemSizeChartEntity', 'item', { cascade: true })
  sizeCharts: ItemSizeChart[];

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

  @Field()
  @Column({ type: 'float', default: 0 })
  digestAverageRating: number;
  @Field(() => Int)
  @Column({ type: 'mediumint', unsigned: true, default: 0 })
  digestCount: number;
  @Field(() => Int, { defaultValue: 0 })
  @Column({ type: 'mediumint', unsigned: true, default: 0 })
  hitCount: number;
  @Field()
  @Column({ type: 'float', default: 0 })
  score: number;

  @Field()
  get originalPrice(): number {
    return this.prices.find(({ isActive }) => isActive === true).originalPrice;
  }
  @Field()
  get sellPrice(): number {
    return this.prices.find(({ isActive }) => isActive === true).sellPrice;
  }
  @Field()
  get finalPrice(): number {
    return this.prices.find(({ isActive }) => isActive === true).finalPrice;
  }
}
