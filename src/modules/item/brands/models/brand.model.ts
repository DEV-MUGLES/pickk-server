import { Field, ObjectType } from '@nestjs/graphql';

import { Seller } from '@item/sellers/models';

import { BrandEntity } from '../entities';

@ObjectType()
export class Brand extends BrandEntity {
  constructor(attributes?: Partial<BrandEntity>) {
    super();
    if (!attributes) {
      return;
    }

    this.id = attributes.id;
    this.createdAt = attributes.createdAt;
    this.updatedAt = attributes.updatedAt;

    this.nameKor = attributes.nameKor;
    this.nameEng = attributes.nameEng;
    this.description = attributes.description;
    this.imageUrl = attributes.imageUrl;

    this.seller = attributes.seller;
    this.sellerId = attributes.sellerId;
  }

  @Field(() => Seller, { nullable: true })
  seller?: Seller;
}
