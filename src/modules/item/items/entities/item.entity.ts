import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

import { BaseIdEntity } from '@src/common/entities/base.entity';

import { BrandEntity } from '../../brands/entities/brand.entity';
import { Brand } from '../../brands/models/brand.model';
import { IItem } from '../interfaces/item.interface';
import { ItemCategory } from '../../item-categories/models/item-category.model';
import { ItemCategoryEntity } from '../../item-categories/entities/item-category.entity';
import { ItemThumbnailImage } from '../models/item-thumbnail-image.model';
import { ItemThumbnailImageEntity } from './item-thumbnail-image.entity';
import { ItemUrl } from '../models/item-url.model';
import { ItemDetailImage } from '../models/item-detail-image.model';
import { ItemOption } from '../models/item-option.model';
import { ItemSalePolicy } from '../models/item-sale-policy.model';

import { ItemSalePolicyEntity } from './item-sale-policy.entity';
import { Product } from '../../products/models/product.model';
import { ItemPrice } from '../models/item-price.model';

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

    this.isManaging = attributes.isManaging;
    this.isMdRecommended = attributes.isManaging;
    this.isSellable = attributes.isSellable;

    this.thumbnailImage = attributes.thumbnailImage;
    this.brand = attributes.brand;
    this.brandId = attributes.brandId;

    this.prices = attributes.prices;
    this.urls = attributes.urls;
    this.detailImages = attributes.detailImages;
    this.options = attributes.options;
    this.products = attributes.products;
    this.majorCategory = attributes.majorCategory;
    this.minorCategory = attributes.minorCategory;
    this.majorCategoryCode = attributes.majorCategoryCode;
    this.minorCategoryCode = attributes.minorCategoryCode;
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
  description?: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  providedCode?: string;

  @Field({ defaultValue: true })
  @Column({
    default: true,
  })
  @IsBoolean()
  isManaging: boolean;

  @Field({ defaultValue: true })
  @Column({
    default: true,
  })
  @IsBoolean()
  isMdRecommended: boolean;

  @Field({ defaultValue: false })
  @Column({
    default: false,
  })
  @IsBoolean()
  isSellable: boolean;

  @Field(() => ItemThumbnailImage, { nullable: true })
  @OneToOne(() => ItemThumbnailImageEntity, {
    eager: true,
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  thumbnailImage: ItemThumbnailImage;

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
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  majorCategoryCode: string;

  @Field({
    nullable: true,
  })
  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  minorCategoryCode: string;

  @Field(() => ItemCategory, {
    nullable: true,
  })
  @ManyToOne(() => ItemCategoryEntity, {
    nullable: true,
  })
  @JoinColumn({ name: 'majorCategoryCode', referencedColumnName: 'code' })
  majorCategory: ItemCategory;

  @Field(() => ItemCategory, {
    nullable: true,
  })
  @ManyToOne(() => ItemCategoryEntity, {
    nullable: true,
  })
  @JoinColumn({ name: 'minorCategoryCode', referencedColumnName: 'code' })
  minorCategory: ItemCategory;
}
