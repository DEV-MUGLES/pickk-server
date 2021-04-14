import { Field, ObjectType } from '@nestjs/graphql';
import { BaseIdEntity } from '@src/common/entities/base.entity';
import { IsOptional, MaxLength } from 'class-validator';
import { Column, Entity } from 'typeorm';
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
}
