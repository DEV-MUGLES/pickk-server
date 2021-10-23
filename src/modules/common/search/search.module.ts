import { forwardRef, Module } from '@nestjs/common';

import { ElasticsearchProviderModule } from '@providers/elasticsearch';

import { DigestsModule } from '@content/digests/digests.module';
import { KeywordsModule } from '@content/keywords/keywords.module';
import { LooksModule } from '@content/looks/looks.module';
import { VideosModule } from '@content/videos/videos.module';
import { ItemsModule } from '@item/items/items.module';
import { OrderItemsModule } from '@order/order-items/order-items.module';
import { RefundRequestsModule } from '@order/refund-requests/refund-requests.module';

import { DigestsSearchService } from './digest.search.service';
import { KeywordSearchService } from './keyword.search.service';
import { LookSearchService } from './look.search.service';
import { VideoSearchService } from './video.search.service';
import { ItemSearchService } from './item.search.service';
import { OrderItemSearchService } from './order-item.search.service';
import { RefundRequestSearchService } from './refund-request.search.service';

@Module({
  imports: [
    ElasticsearchProviderModule,
    forwardRef(() => DigestsModule),
    forwardRef(() => KeywordsModule),
    forwardRef(() => LooksModule),
    forwardRef(() => VideosModule),
    forwardRef(() => ItemsModule),
    forwardRef(() => OrderItemsModule),
    forwardRef(() => RefundRequestsModule),
  ],
  providers: [
    DigestsSearchService,
    KeywordSearchService,
    LookSearchService,
    VideoSearchService,
    ItemSearchService,
    OrderItemSearchService,
    RefundRequestSearchService,
  ],
  exports: [
    DigestsSearchService,
    KeywordSearchService,
    LookSearchService,
    VideoSearchService,
    ItemSearchService,
    OrderItemSearchService,
    RefundRequestSearchService,
  ],
})
export class SearchModule {}
