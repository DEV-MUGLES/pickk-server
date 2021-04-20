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
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { BaseIdEntity } from '@src/common/entities/base.entity';

import { BrandEntity } from '../../brands/entities/brand.entity';
import { Brand } from '../../brands/models/brand.model';
import { IItem } from '../interfaces/item.interface';
import { ItemThumbnailImage } from '../models/item-thumbnail-image.model';
import { ItemThumbnailImageEntity } from './item-thumbnail-image.entity';
import { ItemUrl } from '../models/item-url.model';
import { ItemDetailImage } from '../models/item-detail-image.model';
import { ItemOption } from '../models/item-option.model';
import { ItemPriceUnit } from '../constants/item.enum';
import { ItemSalePolicy } from '../models/item-sale-policy.model';

import { ItemSalePolicyEntity } from './item-sale-policy.entity';
import { Product } from '../../products/models/product.model';

@ObjectType()
@Entity({
  name: 'item',
})
@Index(['salePrice'])
@Index(['providedCode'])
export class ItemEntity extends BaseIdEntity implements IItem {
  constructor(attributes?: Partial<ItemEntity>) {
    super();
    if (!attributes) {
      return;
    }

    this.name = attributes.name;
    this.originalPrice = attributes.originalPrice;
    this.salePrice = attributes.salePrice;
    this.providedCode = attributes.providedCode;

    this.isManaging = attributes.isManaging;
    this.isMdRecommended = attributes.isManaging;
    this.isSellable = attributes.isSellable;

    this.thumbnailImage = attributes.thumbnailImage;
    this.brand = attributes.brand;
    this.brandId = attributes.brandId;
    this.urls = attributes.urls;
    this.detailImages = attributes.detailImages;
    this.options = attributes.options;
    this.products = attributes.products;
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

  @Field(() => Int)
  @Column()
  @IsNumber()
  @Min(1)
  originalPrice: number;

  @Field(() => Int)
  @Column()
  @IsNumber()
  @Min(1)
  salePrice: number;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  providedCode?: string;

  @Field()
  @Column({ nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(1)
  displayPrice?: number;

  @Field(() => ItemPriceUnit, { defaultValue: ItemPriceUnit.KRW })
  @Column({
    type: 'enum',
    enum: ItemPriceUnit,
    default: ItemPriceUnit.KRW,
  })
  @IsEnum(ItemPriceUnit)
  @IsOptional()
  priceUnit?: ItemPriceUnit;

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
}
