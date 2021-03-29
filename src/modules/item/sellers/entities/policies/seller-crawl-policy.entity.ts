import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { IsBoolean } from 'class-validator';

import { BaseEntity } from '@src/common/entities/base.entity';

import { ISellerCrawlPolicy } from '../../interfaces/policies';

@ObjectType()
@Entity('seller_crawl_policy')
export class SellerCrawlPolicyEntity
  extends BaseEntity
  implements ISellerCrawlPolicy {
  constructor(attributes?: Partial<SellerCrawlPolicyEntity>) {
    super();
    if (!attributes) {
      return;
    }

    this.id = attributes.id;
    this.createdAt = attributes.createdAt;
    this.updatedAt = attributes.updatedAt;

    this.isInspectingNew = attributes.isInspectingNew;
    this.isUpdatingSaleItemInfo = attributes.isUpdatingSaleItemInfo;
  }

  @Field()
  @Column()
  @IsBoolean()
  isInspectingNew: boolean;

  @Field()
  @Column()
  @IsBoolean()
  isUpdatingSaleItemInfo: boolean;
}
