import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsRepository } from './items.repository';
import { ItemsResolver } from './items.resolver';
import { ItemsService } from './items.service';

@Module({
  imports: [TypeOrmModule.forFeature([ItemsRepository])],
  providers: [ItemsResolver, ItemsService],
})
export class ItemsModule {}
