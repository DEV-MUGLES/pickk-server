import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { IsBoolean } from 'class-validator';

import { BaseIdEntity } from '@common/entities';

import { ISellerCrawlPolicy } from '../../interfaces/policies';

@ObjectType()
@Entity('seller_crawl_policy')
export class SellerCrawlPolicyEntity
  extends BaseIdEntity
  implements ISellerCrawlPolicy
{
  constructor(attributes?: Partial<SellerCrawlPolicyEntity>) {
    super();
    if (!attributes) {
      return;
    }

    this.id = attributes.id;
    this.createdAt = attributes.createdAt;
    this.updatedAt = attributes.updatedAt;

    this.isInspectingNew = attributes.isInspectingNew;
    this.isUpdatingItems = attributes.isUpdatingItems;
  }

  @Field()
  @Column()
  @IsBoolean()
  isInspectingNew: boolean;

  @Field()
  @Column()
  @IsBoolean()
  isUpdatingItems: boolean;
}
