import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CampaignsRepository } from './campaigns.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CampaignsRepository])],
})
export class CampaignsModule {}
