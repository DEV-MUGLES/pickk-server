import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemProfilesRepository } from './item-profiles.repository';
import { ItemProfilesResolver } from './item-profiles.resolver';
import { ItemProfilesService } from './item-profiles.service';

@Module({
  imports: [TypeOrmModule.forFeature([ItemProfilesRepository])],
  providers: [ItemProfilesResolver, ItemProfilesService],
})
export class ItemProfilesModule {}
