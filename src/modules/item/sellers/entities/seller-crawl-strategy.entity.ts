import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { IsBoolean, IsOptional, IsUrl, MaxLength } from 'class-validator';

import { BaseIdEntity } from '@common/entities';

import { ISellerCrawlStrategy } from '../interfaces';

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
