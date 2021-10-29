import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ItemsModule } from '@item/items/items.module';

import { CampaignsRepository } from './campaigns.repository';
import { CampaignsResolver } from './campaigns.resolver';
import { CampaignsService } from './campaigns.service';

@Module({
  imports: [TypeOrmModule.forFeature([CampaignsRepository]), ItemsModule],
  providers: [CampaignsResolver, CampaignsService],
})
export class CampaignsModule {}
