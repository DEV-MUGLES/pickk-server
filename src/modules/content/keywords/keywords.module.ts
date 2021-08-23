import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  KeywordsRepository,
  KeywordClasssRepository,
  KeywordMatchTagsRepository,
} from './keywords.repository';
import { KeywordsResolver } from './keywords.resolver';
import { KeywordsService } from './keywords.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KeywordsRepository,
      KeywordClasssRepository,
      KeywordMatchTagsRepository,
    ]),
  ],
  providers: [KeywordsResolver, KeywordsService],
})
export class KeywordsModule {}
