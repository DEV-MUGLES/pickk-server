import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  KeywordsRepository,
  KeywordClasssRepository,
  KeywordMatchTagsRepository,
} from './keywords.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KeywordsRepository,
      KeywordClasssRepository,
      KeywordMatchTagsRepository,
    ]),
  ],
})
export class KeywordsModule {}
