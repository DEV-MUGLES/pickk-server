import { Field, ObjectType } from '@nestjs/graphql';
import { BaseIdEntity } from '@src/common/entities/base.entity';
import { IsUrl } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { ISellerCrawlStrategy } from '../interfaces/seller-crawl-strategy.interface';

@ObjectType()
@Entity('seller_crawl_strategy')
export class SellerCrawlStrategyEntity
  extends BaseIdEntity
  implements ISellerCrawlStrategy {
  @Field()
  @Column({
    type: 'varchar',
    length: 50,
  })
  itemLinksSelector: string;

  @Field()
  @Column({
    type: 'varchar',
    length: 50,
  })
  @IsUrl()
  baseUrl: string;

  @Field()
  @Column()
  startPathNamesJoin: string;
}
