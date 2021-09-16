import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { IsOptional, IsUrl, MaxLength } from 'class-validator';

import { BaseIdEntity } from '@common/entities';

import { ISeller, ISellerCrawlStrategy } from '../interfaces';

@ObjectType()
@Entity('seller_crawl_strategy')
export class SellerCrawlStrategyEntity
  extends BaseIdEntity
  implements ISellerCrawlStrategy
{
  constructor(attributes?: Partial<SellerCrawlStrategyEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.seller = attributes.seller;
    this.sellerId = attributes.sellerId;

    this.itemsSelector = attributes.itemsSelector;
    this.codeRegex = attributes.codeRegex;
    this.pagination = attributes.pagination;
    this.pageParam = attributes.pageParam;
    this.baseUrl = attributes.baseUrl;
    this.startPathNamesJoin = attributes.startPathNamesJoin;
  }

  @OneToOne('SellerEntity', 'crawlStrategy', { onDelete: 'CASCADE' })
  @JoinColumn()
  seller: ISeller;
  @Field(() => Int)
  @Column()
  sellerId: number;

  @Field()
  @Column({ length: 50 })
  @MaxLength(50)
  itemsSelector: string;
  @Field()
  @Column({ length: 30 })
  @MaxLength(30)
  codeRegex: string;
  @Field()
  @Column()
  pagination: boolean;
  @Field({ nullable: true })
  @Column({ length: 20, nullable: true })
  @MaxLength(20)
  @IsOptional()
  pageParam: string;
  @Field()
  @Column({ length: 75 })
  @IsUrl()
  @MaxLength(75)
  baseUrl: string;
  @Field({ description: "'<>'으로 join된 상태다." })
  @Column()
  @MaxLength(255)
  startPathNamesJoin: string;
}
