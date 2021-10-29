import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CampaignsRepository } from './campaigns.repository';
import { CampaignsResolver } from './campaigns.resolver';
import { CampaignsService } from './campaigns.service';

@Module({
  imports: [TypeOrmModule.forFeature([CampaignsRepository])],
  providers: [CampaignsResolver, CampaignsService],
})
export class CampaignsModule {}
