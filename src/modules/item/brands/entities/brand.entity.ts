import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToOne } from 'typeorm';

import { BaseIdEntity } from '@common/entities';
import { SellerEntity } from '@item/sellers/entities/seller.entity';

import { IBrand } from '../interfaces';

@ObjectType()
@Entity({ name: 'brand' })
export class BrandEntity extends BaseIdEntity implements IBrand {
  @Field()
  @Column({ length: 30 })
  nameKor: string;
  @Field({ nullable: true })
  @Column({ length: 30, nullable: true })
  nameEng?: string;
  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;
  @Field({ nullable: true })
  @Column({ nullable: true })
  imageUrl?: string;

  @OneToOne('SellerEntity', 'brand', { nullable: true })
  seller?: SellerEntity;
  @Field(() => Int, { nullable: true })
  sellerId?: number;
}
