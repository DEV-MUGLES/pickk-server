import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import { BaseIdEntity } from '@common/entities';
import { BrandEntity } from '@item/brands/entities';
import { Brand } from '@item/brands/models';

import { CouponType } from '../constants';
import { ICouponSpecification } from '../interfaces';

@ObjectType()
@Entity('coupon_specification')
export class CouponSpecificationEntity
  extends BaseIdEntity
  implements ICouponSpecification
{
  constructor(attributes?: Partial<CouponSpecificationEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.brand = attributes.brand;
    this.brandId = attributes.brandId;

    this.name = attributes.name;
    this.type = attributes.type;

    this.discountAmount = attributes.discountAmount;
    this.discountRate = attributes.discountRate;

    this.minimumForUse = attributes.minimumForUse;
    this.maximumDiscountPrice = attributes.maximumDiscountPrice;

    this.availableAt = attributes.availableAt;
    this.expireAt = attributes.expireAt;
  }

  @Field(() => Brand, { nullable: true })
  @ManyToOne(() => BrandEntity, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn()
  brand?: Brand;
  @Field({ nullable: true })
  @Column({ type: 'int', nullable: true })
  brandId: number;

  @Field({ description: '최대 30자' })
  @Column({ length: 30 })
  @MaxLength(30)
  name: string;
  @Field(() => CouponType)
  @Column({ type: 'enum', enum: CouponType })
  @IsEnum(CouponType)
  type: CouponType;

  @Field(() => Int, { nullable: true, description: '1~99 정수' })
  @Column({ type: 'tinyint', nullable: true, unsigned: true })
  @IsInt()
  @Min(1)
  @Max(99)
  @IsOptional()
  discountRate?: number;
  @Field(() => Int, { nullable: true })
  @Column({ type: 'mediumint', nullable: true, unsigned: true })
  @IsInt()
  @Min(1)
  @IsOptional()
  discountAmount?: number;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'mediumint', nullable: true, unsigned: true })
  @IsInt()
  @Min(1)
  @IsOptional()
  minimumForUse?: number;
  @Field(() => Int, { nullable: true })
  @Column({ type: 'mediumint', nullable: true, unsigned: true })
  @IsInt()
  @Min(1)
  @IsOptional()
  maximumDiscountPrice?: number;

  @Field({
    nullable: true,
    description: '이 값으로 클라이언트에서 필터링 해주세요.',
  })
  @Column({ nullable: true })
  @IsDate()
  @IsOptional()
  availableAt?: Date;
  @Field()
  @Column()
  @IsDate()
  expireAt: Date;
}
