import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CampaignsRepository } from './capaigns.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CampaignsRepository])],
})
export class CampaignsModule {}
