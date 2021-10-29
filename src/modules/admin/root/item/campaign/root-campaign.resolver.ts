import { Injectable, UseGuards } from '@nestjs/common';
import { Args, Int, Mutation } from '@nestjs/graphql';

import { Roles } from '@auth/decorators';
import { JwtAuthGuard } from '@auth/guards';
import { BaseResolver } from '@common/base.resolver';
import { IntArgs } from '@common/decorators';

import { CampaignsService } from '@item/campaigns/campaigns.service';
import {
  CampaignRelationType,
  CAMPAIGN_RELATIONS,
} from '@item/campaigns/constants';
import { CreateCampaignInput, UpdateCampaignInput } from '@item/campaigns/dtos';
import { Campaign } from '@item/campaigns/models';
import { UserRole } from '@user/users/constants';

@Injectable()
export class RootCampaignResolver extends BaseResolver<CampaignRelationType> {
  relations = CAMPAIGN_RELATIONS;
  constructor(private readonly campaignsService: CampaignsService) {
    super();
  }

  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Campaign)
  async createRootCampaign(
    @Args('input') input: CreateCampaignInput
  ): Promise<Campaign> {
    return await this.campaignsService.create(input);
  }

  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Campaign)
  async updateRootCampaign(
    @IntArgs('id') id: number,
    @Args('input') input: UpdateCampaignInput
  ) {
    await this.campaignsService.update(id, input);
    return await this.campaignsService.get(id);
  }

  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async removeRootCampaign(@IntArgs('id') id: number): Promise<Boolean> {
    await this.campaignsService.remove(id);
    return true;
  }

  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Campaign)
  async updateRootCampaignItems(
    @IntArgs('id') id: number,
    @Args('itemIds', { type: () => [Int] }) itemIds: number[]
  ) {
    await this.campaignsService.updateItems(id, itemIds);
    return this.campaignsService.get(id, ['items']);
  }
}
