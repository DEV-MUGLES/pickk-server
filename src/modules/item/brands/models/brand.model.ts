import { Field, ObjectType } from '@nestjs/graphql';
import { Seller } from '../../sellers/models/seller.model';

import { BrandEntity } from '../entities/brand.entity';

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
  }

  @Field(() => Seller, {
    nullable: true,
  })
  seller?: Seller;
}
