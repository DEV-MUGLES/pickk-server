import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { BaseIdEntity } from '@common/entities';

import { ISeller, ISellerCrawlPolicy } from '../../interfaces';

@ObjectType()
@Entity('seller_crawl_policy')
export class SellerCrawlPolicyEntity
  extends BaseIdEntity
  implements ISellerCrawlPolicy
{
  constructor(attributes?: Partial<SellerCrawlPolicyEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.seller = attributes.seller;
    this.sellerId = attributes.sellerId;

    this.isInspectingNew = attributes.isInspectingNew;
    this.isUpdatingItems = attributes.isUpdatingItems;
  }

  @OneToOne('SellerEntity', 'crawlPolicy', { onDelete: 'CASCADE' })
  @JoinColumn()
  seller: ISeller;
  @Field(() => Int)
  @Column()
  sellerId: number;

  @Field({ description: '크롤링된 새로운 아이템들을 추가 등록하는가' })
  @Column({ default: true })
  isInspectingNew: boolean;
  @Field({ description: '기존 아이템들의 이름/가격을 업데이트하는가' })
  @Column({ default: true })
  isUpdatingItems: boolean;
}
