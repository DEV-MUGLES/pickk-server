import { forwardRef, Module } from '@nestjs/common';

import { ElasticsearchProviderModule } from '@providers/elasticsearch';

import { DigestsModule } from '@content/digests/digests.module';
import { KeywordsModule } from '@content/keywords/keywords.module';
import { LooksModule } from '@content/looks/looks.module';
import { VideosModule } from '@content/videos/videos.module';
import { ItemsModule } from '@item/items/items.module';

import { DigestsSearchService } from './digest.search.service';
import { KeywordSearchService } from './keyword.search.service';
import { LookSearchService } from './look.search.service';
import { VideoSearchService } from './video.search.service';
import { ItemSearchService } from './item.search.service';

@Module({
  imports: [
    ElasticsearchProviderModule,
    forwardRef(() => DigestsModule),
    forwardRef(() => KeywordsModule),
    forwardRef(() => LooksModule),
    forwardRef(() => VideosModule),
    forwardRef(() => ItemsModule),
  ],
  providers: [
    DigestsSearchService,
    KeywordSearchService,
    LookSearchService,
    VideoSearchService,
    ItemSearchService,
  ],
  exports: [
    DigestsSearchService,
    KeywordSearchService,
    LookSearchService,
    VideoSearchService,
    ItemSearchService,
  ],
})
export class SearchModule {}
