import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StyleTagsRepository } from './style-tags.repository';
import { StyleTagsResolver } from './style-tags.resolver';
import { StyleTagsService } from './style-tags.service';

@Module({
  imports: [TypeOrmModule.forFeature([StyleTagsRepository])],
  providers: [StyleTagsResolver, StyleTagsService],
})
export class StyleTagsModule {}
