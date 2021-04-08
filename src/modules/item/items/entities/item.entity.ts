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
import { IsBoolean, IsNumber, IsString, Min } from 'class-validator';

import { BaseEntity } from '@src/common/entities/base.entity';

import { BrandEntity } from '../../brands/entities/brand.entity';
import { Brand } from '../../brands/models/brand.model';
import { IItem } from '../interfaces/item.interface';
import { ItemThumbnailImage } from '../models/item-thumbnail-image.model';
import { ItemThumbnailImageEntity } from './item-thumbnail-image.entity';
import { ItemUrl } from '../models/item-url.model';
import { ItemDetailImage } from '../models/item-detail-image.model';

@ObjectType()
@Entity({
  name: 'item',
})
@Index(['salePrice'])
export class ItemEntity extends BaseEntity implements IItem {
  constructor(attributes?: Partial<ItemEntity>) {
    super();
    if (!attributes) {
      return;
    }

    this.name = attributes.name;
    this.originalPrice = attributes.originalPrice;
    this.salePrice = attributes.salePrice;
    this.isAvailable = attributes.isAvailable;

    this.thumbnailImage = attributes.thumbnailImage;
    this.brand = attributes.brand;
    this.brandId = attributes.brandId;
    this.urls = attributes.urls;
  }

  @Field()
  @Column()
  @IsString()
  name: string;

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

  @Field()
  @Column({
    default: true,
  })
  @IsBoolean()
  isAvailable: boolean;

  @Field(() => ItemThumbnailImage)
  @OneToOne(() => ItemThumbnailImageEntity, {
    eager: true,
    cascade: true,
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
}
