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
import { IItemProfile } from '../interfaces/item-profile.interface';
import { ItemThumbnailImage } from '../models/item-thumbnail-image.model';
import { ItemThumbnailImageEntity } from './item-thumbnail-image.entity';
import { ItemProfileUrl } from '../models/item-profile-url.model';

@ObjectType()
@Entity({
  name: 'item_profile',
})
@Index(['salePrice'])
export class ItemProfileEntity extends BaseEntity implements IItemProfile {
  constructor(attributes?: Partial<ItemProfileEntity>) {
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

  @OneToMany('ItemProfileUrlEntity', 'itemProfile', {
    cascade: true,
  })
  urls: ItemProfileUrl[];
}
