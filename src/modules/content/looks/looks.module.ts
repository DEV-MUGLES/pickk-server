import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LooksRepository } from './looks.repository';
import { LooksResolver } from './looks.resolver';
import { LooksService } from './looks.service';

@Module({
  imports: [TypeOrmModule.forFeature([LooksRepository])],
  providers: [LooksResolver, LooksService],
})
export class LooksModule {}
