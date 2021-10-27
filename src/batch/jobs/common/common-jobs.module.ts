import { Module } from '@nestjs/common';

import { BatchWorker } from '@batch/batch.worker';

import { JobsModule } from '@mcommon/jobs/jobs.module';
import { SearchModule } from '@mcommon/search/search.module';
import { InquiriesModule } from '@item/inquiries/inquiries.module';
import { ItemsModule } from '@item/items/items.module';
import { LooksModule } from '@content/looks/looks.module';
import { VideosModule } from '@content/videos/videos.module';
import { DigestsModule } from '@content/digests/digests.module';
import { OrderItemsModule } from '@order/order-items/order-items.module';
import { RefundRequestsModule } from '@order/refund-requests/refund-requests.module';
import { ExchangeRequestsModule } from '@order/exchange-requests/exchange-requests.module';

import { IndexItemsJob, IndexItemsStep } from './index-items';
import { IndexDigestsJob, IndexDigestsStep } from './index-digests';
import { IndexLooksJob, IndexLooksStep } from './index-looks';
import { IndexVideosJob, IndexVideosStep } from './index-videos';
import { IndexOrderItemsJob, IndexOrderItemsStep } from './index-order-items';
import {
  IndexRefundRequestsJob,
  IndexRefundRequestsStep,
} from './index-refund-requests';
import {
  IndexExchangeRequestsJob,
  IndexExchangeRequestsStep,
} from './index-exchange-requests';
import { IndexInquiresStep, IndexInquiriesJob } from './index-inquires';

import { CommonJobsController } from './common-jobs.controller';
import { CommonJobsService } from './common-jobs.service';

@Module({
  imports: [
    JobsModule,
    SearchModule,
    ItemsModule,
    DigestsModule,
    LooksModule,
    VideosModule,
    OrderItemsModule,
    RefundRequestsModule,
    ExchangeRequestsModule,
    InquiriesModule,
  ],
  controllers: [CommonJobsController],
  providers: [
    BatchWorker,
    CommonJobsService,
    IndexItemsJob,
    IndexItemsStep,
    IndexDigestsJob,
    IndexDigestsStep,
    IndexLooksJob,
    IndexLooksStep,
    IndexVideosJob,
    IndexVideosStep,
    IndexOrderItemsJob,
    IndexOrderItemsStep,
    IndexRefundRequestsJob,
    IndexRefundRequestsStep,
    IndexExchangeRequestsJob,
    IndexExchangeRequestsStep,
    IndexInquiriesJob,
    IndexInquiresStep,
  ],
})
export class CommonJobsModule {}
