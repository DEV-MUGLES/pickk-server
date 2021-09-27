import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToOne } from 'typeorm';

import { BaseIdEntity } from '@common/entities';
import { SellerEntity } from '@item/sellers/entities/seller.entity';

import { IBrand } from '../interfaces';

@ObjectType()
@Entity({ name: 'brand' })
export class BrandEntity extends BaseIdEntity implements IBrand {
  constructor(attributes?: Partial<BrandEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.seller = attributes.seller;

    this.nameKor = attributes.nameKor;
    this.nameEng = attributes.nameEng;
    this.description = attributes.description;
    this.imageUrl = attributes.imageUrl;
  }

  @OneToOne('SellerEntity', 'brand', { nullable: true })
  seller: SellerEntity;

  @Field()
  @Column({ length: 30 })
  nameKor: string;
  @Field({ nullable: true })
  @Column({ length: 30, nullable: true })
  nameEng?: string;
  @Field({ nullable: true })
  @Column({ length: 512, nullable: true })
  description?: string;
  @Field({ nullable: true })
  @Column({ nullable: true })
  imageUrl?: string;
}
