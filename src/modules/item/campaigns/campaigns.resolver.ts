import { Injectable } from '@nestjs/common';
import { Args, Info, Int, Mutation, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { BaseResolver } from '@common/base.resolver';
import { IntArgs } from '@common/decorators';

import { CampaignRelationType, CAMPAIGN_RELATIONS } from './constants';
import { CreateCampaignInput, UpdateCampaignInput } from './dtos';
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

  @Mutation(() => Campaign)
  async createCampaign(
    @Args('input') input: CreateCampaignInput
  ): Promise<Campaign> {
    return await this.campaignsService.create(input);
  }

  @Mutation(() => Campaign)
  async updateCampaign(
    @IntArgs('id') id: number,
    @Args('input') input: UpdateCampaignInput
  ) {
    await this.campaignsService.update(id, input);
    return await this.campaignsService.get(id);
  }

  @Mutation(() => Boolean)
  async removeCampaign(@IntArgs('id') id: number): Promise<Boolean> {
    await this.campaignsService.remove(id);
    return true;
  }

  @Mutation(() => Campaign)
  async updateCampaignItems() {}

  @Mutation(() => Campaign)
  async removeCampaignItems() {}
}
