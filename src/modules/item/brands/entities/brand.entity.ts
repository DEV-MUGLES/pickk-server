import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsUrl, MaxLength } from 'class-validator';
import { Column, Entity, OneToOne } from 'typeorm';

import { BaseIdEntity } from '@common/entities';
import { SellerEntity } from '@item/sellers/entities/seller.entity';

import { IBrand } from '../interfaces/brand.interface';

@ObjectType()
@Entity({ name: 'brand' })
export class BrandEntity extends BaseIdEntity implements IBrand {
  @Field()
  @Column({
    type: 'varchar',
    length: 30,
  })
  @MaxLength(30)
  nameKor: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  @MaxLength(30)
  @IsOptional()
  nameEng?: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    nullable: true,
  })
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  @IsUrl()
  imageUrl?: string;

  @OneToOne('SellerEntity', 'brand', {
    nullable: true,
  })
  seller?: SellerEntity;
}
