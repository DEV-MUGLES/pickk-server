import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RewardEventsRepository } from './rewards.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RewardEventsRepository])],
})
export class RewardsModule {}
