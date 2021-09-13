import { Field, ObjectType } from '@nestjs/graphql';

import { Seller } from '@item/sellers/models';

import { BrandEntity } from '../entities';

@ObjectType()
export class Brand extends BrandEntity {
  @Field(() => Seller, { nullable: true })
  seller?: Seller;
}
