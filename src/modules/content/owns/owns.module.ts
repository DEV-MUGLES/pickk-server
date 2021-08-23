import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { KeywordsModule } from '@content/keywords/keywords.module';

import { OwnsRepository } from './owns.repository';
import { OwnsResolver } from './owns.resolver';
import { OwnsService } from './owns.service';

@Module({
  imports: [TypeOrmModule.forFeature([OwnsRepository]), KeywordsModule],
  providers: [OwnsResolver, OwnsService],
})
export class OwnsModule {}
