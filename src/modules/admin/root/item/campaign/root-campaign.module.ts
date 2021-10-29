import { Module } from '@nestjs/common';

import { CampaignsModule } from '@item/campaigns/campaigns.module';

import { RootCampaignResolver } from './root-campaign.resolver';

@Module({
  imports: [CampaignsModule],
  providers: [RootCampaignResolver],
})
export class RootCampaignModule {}
