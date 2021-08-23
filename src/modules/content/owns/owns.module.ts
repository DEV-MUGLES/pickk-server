import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OwnsRepository } from './owns.repository';
import { OwnsResolver } from './owns.resolver';
import { OwnsService } from './owns.service';

@Module({
  imports: [TypeOrmModule.forFeature([OwnsRepository])],
  providers: [OwnsResolver, OwnsService],
})
export class OwnsModule {}
