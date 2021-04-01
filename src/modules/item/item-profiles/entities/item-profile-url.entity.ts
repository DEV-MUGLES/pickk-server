import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IsBoolean, IsUrl } from 'class-validator';

import { BaseEntity } from '@src/common/entities/base.entity';

import { IItemProfileUrl } from '../interfaces/item-profile-url.interface';
import { ItemProfileEntity } from './item-profile.entity';

@ObjectType()
@Entity('item_profile_url')
export class ItemProfileUrlEntity
  extends BaseEntity
  implements IItemProfileUrl {
  constructor(attributes?: Partial<ItemProfileUrlEntity>) {
    super();
    if (!attributes) {
      return;
    }

    this.url = attributes.url;
    this.isPrimary = attributes.isPrimary;
    this.isAvailable = attributes.isAvailable;
    this.itemProfile = attributes.itemProfile;
    this.itemProfileId = attributes.itemProfileId;
  }

  @Field()
  @Column()
  @IsUrl()
  url: string;

  @Field()
  @Column({
    default: false,
  })
  @IsBoolean()
  isPrimary: boolean;

  @Field()
  @Column({
    default: true,
  })
  @IsBoolean()
  isAvailable: boolean;

  @ManyToOne('ItemProfileEntity', 'urls', {
    onDelete: 'CASCADE',
  })
  itemProfile: ItemProfileEntity;

  @Field(() => Int)
  @Column()
  itemProfileId: number;
}
