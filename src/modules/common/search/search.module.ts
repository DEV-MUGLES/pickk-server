import { forwardRef, Module } from '@nestjs/common';

import { ElasticsearchProviderModule } from '@providers/elasticsearch';

import { DigestsModule } from '@content/digests/digests.module';
import { KeywordsModule } from '@content/keywords/keywords.module';
import { LooksModule } from '@content/looks/looks.module';
import { VideosModule } from '@content/videos/videos.module';
import { InquiriesModule } from '@item/inquiries/inquiries.module';
import { ItemsModule } from '@item/items/items.module';
import { ExchangeRequestsModule } from '@order/exchange-requests/exchange-requests.module';
import { OrderItemsModule } from '@order/order-items/order-items.module';
import { RefundRequestsModule } from '@order/refund-requests/refund-requests.module';

import { DigestsSearchService } from './digest.search.service';
import { ExchangeRequestSearchService } from './exchange-request.search.service';
import { InquirySearchService } from './inquiry.search.service';
import { ItemSearchService } from './item.search.service';
import { KeywordSearchService } from './keyword.search.service';
import { LookSearchService } from './look.search.service';
import { OrderItemSearchService } from './order-item.search.service';
import { RefundRequestSearchService } from './refund-request.search.service';
import { VideoSearchService } from './video.search.service';

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
    forwardRef(() => ExchangeRequestsModule),
    forwardRef(() => InquiriesModule),
  ],
  providers: [
    DigestsSearchService,
    ExchangeRequestSearchService,
    InquirySearchService,
    ItemSearchService,
    KeywordSearchService,
    LookSearchService,
    OrderItemSearchService,
    RefundRequestSearchService,
    VideoSearchService,
  ],
  exports: [
    DigestsSearchService,
    ExchangeRequestSearchService,
    InquirySearchService,
    ItemSearchService,
    KeywordSearchService,
    LookSearchService,
    OrderItemSearchService,
    RefundRequestSearchService,
    VideoSearchService,
  ],
})
export class SearchModule {}
