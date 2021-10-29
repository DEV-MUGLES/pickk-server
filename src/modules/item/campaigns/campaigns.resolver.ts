import { Injectable } from '@nestjs/common';
import { Info, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { BaseResolver } from '@common/base.resolver';
import { IntArgs } from '@common/decorators';

import { CampaignRelationType, CAMPAIGN_RELATIONS } from './constants';
import { Campaign } from './models';

import { CampaignsService } from './campaigns.service';

@Injectable()
export class CampaignsResolver extends BaseResolver<CampaignRelationType> {
  relations = CAMPAIGN_RELATIONS;
  constructor(private readonly campaignsService: CampaignsService) {
    super();
  }

  @Query(() => Campaign)
  async campaign(
    @IntArgs('id') id: number,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Campaign> {
    return await this.campaignsService.get(id, this.getRelationsFromInfo(info));
  }

  @Query(() => [Campaign])
  async campaigns(@Info() info?: GraphQLResolveInfo): Promise<Campaign[]> {
    return await this.campaignsService.list(this.getRelationsFromInfo(info));
  }
}
