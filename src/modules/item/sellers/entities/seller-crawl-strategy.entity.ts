import { Field, ObjectType } from '@nestjs/graphql';
import { BaseIdEntity } from '@src/common/entities/base.entity';
import { IsBoolean, IsOptional, IsUrl, MaxLength } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { ISellerCrawlStrategy } from '../interfaces/seller-crawl-strategy.interface';

@ObjectType()
@Entity('seller_crawl_strategy')
export class SellerCrawlStrategyEntity
  extends BaseIdEntity
  implements ISellerCrawlStrategy
{
  @Field()
  @Column({
    type: 'varchar',
    length: 50,
  })
  @MaxLength(50)
  itemsSelector: string;

  @Field()
  @Column({
    type: 'varchar',
    length: 30,
  })
  @MaxLength(30)
  codeRegex: string;

  @Field()
  @Column()
  @IsBoolean()
  pagination: boolean;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  @MaxLength(20)
  @IsOptional()
  pageParam: string;

  @Field()
  @Column({
    type: 'varchar',
    length: 75,
  })
  @IsUrl()
  @MaxLength(75)
  baseUrl: string;

  @Field({ description: "'<>'으로 join된 상태다." })
  @Column()
  @MaxLength(255)
  startPathNamesJoin: string;
}
