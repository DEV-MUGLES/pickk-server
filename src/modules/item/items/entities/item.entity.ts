import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { IsUrl } from 'class-validator';

import { BaseIdEntity } from '@common/entities';

import { IDigest } from '@content/digests/interfaces';
import { IItemsGroupItem } from '@exhibition/items-groups/interfaces';
import { BrandEntity } from '@item/brands/entities';
import { IBrand } from '@item/brands/interfaces';
import { ICampaign } from '@item/campaigns/interfaces';
import { IItemCategory } from '@item/item-categories/interfaces';
import { IProduct } from '@item/products/interfaces';

import {
  IItem,
  IItemOption,
  IItemSalePolicy,
  IItemSizeChart,
} from '../interfaces';

import { ItemUrl } from '../models/item-url.model';
import { ItemDetailImage } from '../models/item-detail-image.model';
import { ItemPrice } from '../models/item-price.model';

@ObjectType()
@Entity({
  name: 'item',
})
@Index('idx-providedCode', ['providedCode'])
@Index('idx-majorCategoryId:code', ['majorCategoryId', 'score'])
@Index('idx-minorCategoryId:code', ['minorCategoryId', 'score'])
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

    this.digests = attributes.digests;

    this.majorCategory = attributes.majorCategory;
    this.minorCategory = attributes.minorCategory;
    this.majorCategoryId = attributes.majorCategoryId;
    this.minorCategoryId = attributes.minorCategoryId;

    this.salePolicy = attributes.salePolicy;
    this.prices = attributes.prices;
    this.urls = attributes.urls;
    this.detailImages = attributes.detailImages;
    this.sizeChart = attributes.sizeChart;

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

  @ManyToOne(() => BrandEntity, { onDelete: 'RESTRICT' })
  @JoinColumn()
  brand: IBrand;
  @Field(() => Int)
  @Column()
  brandId: number;

  @OneToMany('ItemOptionEntity', 'item', { cascade: true })
  options: IItemOption[];
  @OneToMany('ProductEntity', 'item', { cascade: true })
  products: IProduct[];
  @ManyToMany('CampaignEntity', 'items')
  campaigns: ICampaign[];

  @OneToMany('DigestEntity', 'item')
  digests: IDigest[];

  @ManyToOne('ItemCategoryEntity', { onDelete: 'SET NULL', nullable: true })
  @JoinColumn()
  majorCategory?: IItemCategory;
  @Field({ nullable: true })
  @Column({ nullable: true })
  majorCategoryId?: number;
  @ManyToOne('ItemCategoryEntity', { onDelete: 'SET NULL', nullable: true })
  @JoinColumn()
  minorCategory?: IItemCategory;
  @Field({ nullable: true })
  @Column({ nullable: true })
  minorCategoryId?: number;

  @OneToOne('ItemSalePolicyEntity', { cascade: true, nullable: true })
  @JoinColumn()
  salePolicy: IItemSalePolicy;
  @OneToOne('ItemSizeChartEntity', {
    cascade: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  sizeChart: IItemSizeChart;
  @OneToMany('ItemPriceEntity', 'item', { cascade: true, eager: true })
  prices: ItemPrice[];
  @OneToMany('ItemUrlEntity', 'item', { cascade: true })
  urls: ItemUrl[];
  @OneToMany('ItemDetailImageEntity', 'item', { cascade: true })
  detailImages: ItemDetailImage[];

  @OneToOne('ItemsGroupItemEntity', 'item')
  itemsGroupItem: IItemsGroupItem;

  @Field()
  @Column()
  name: string;
  @Field({ nullable: true })
  @Column({ length: 511, nullable: true })
  description?: string;
  @Field({ nullable: true })
  @Column({ length: 100, nullable: true })
  providedCode?: string;
  @Field()
  @Column()
  @IsUrl()
  imageUrl: string;

  @Field({ defaultValue: true })
  @Column({ default: true })
  isMdRecommended: boolean;
  @Field({ defaultValue: false })
  @Column({ default: false })
  isSellable: boolean;
  @Field({ defaultValue: true })
  @Column({ default: true })
  isInfiniteStock: boolean;
  @Field({ defaultValue: false })
  @Column({ default: false })
  isPurchasable: boolean;
  @Field({ defaultValue: false })
  @Column({ default: false })
  isSoldout: boolean;

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

  @Field({ description: '[MODEL ONLY]' })
  get originalPrice(): number {
    return this.prices.find(({ isActive }) => isActive === true).originalPrice;
  }
  @Field({ description: '[MODEL ONLY]' })
  get sellPrice(): number {
    return this.prices.find(({ isActive }) => isActive === true).sellPrice;
  }
  @Field({ description: '[MODEL ONLY]' })
  get finalPrice(): number {
    return this.prices.find(({ isActive }) => isActive === true).finalPrice;
  }
  @Field({ description: '[MODEL ONLY]' })
  get pickkDiscountRate(): number {
    return this.prices.find(({ isActive }) => isActive === true)
      .pickkDiscountRate;
  }
}
