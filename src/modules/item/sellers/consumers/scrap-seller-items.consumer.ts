import { Logger } from '@nestjs/common';
import {
  SqsConsumerEvent,
  SqsConsumerEventHandler,
  SqsMessageHandler,
  SqsProcess,
} from '@nestjs-packages/sqs';

import {
  allSettled,
  FulfillResponse,
  isFulfilled,
  RejectResponse,
  splitRegexString,
} from '@common/helpers';
import { SCRAP_SELLER_ITEMS_QUEUE } from '@queue/constants';
import { ScrapSellerItemsMto, SellerItemsScrapResult } from '@queue/mtos';
import {
  CrawlerProviderService,
  ItemInfoCrawlResult,
} from '@providers/crawler';

import { SellerProducer } from '../producers';

import { SellersCrawlService } from '../sellers.crawl.service';

@SqsProcess(SCRAP_SELLER_ITEMS_QUEUE)
export class ScrapSellerItemsConsumer {
  constructor(
    private readonly sellersCrawlService: SellersCrawlService,
    private readonly crawlerProviderService: CrawlerProviderService,
    private readonly sellerProducer: SellerProducer,
    private readonly logger: Logger
  ) {}

  @SqsMessageHandler()
  async scrapSellerItems(message: AWS.SQS.Message) {
    const { Body } = message;
    const scrapSellerItemsMto: ScrapSellerItemsMto = JSON.parse(Body);
    const {
      brand,
      crawlStrategy: { codeRegex },
      saleStrategy: { pickkDiscountRate },
    } = scrapSellerItemsMto;

    const itemUrls = await this.sellersCrawlService.scrapItemUrls(
      scrapSellerItemsMto
    );
    const items = await this.crawlItems(itemUrls);
    const uniqueItems: SellerItemsScrapResult[] = [];
    for (const item of items) {
      const [, code] = item.url.match(
        new RegExp(...splitRegexString(codeRegex))
      );
      if (uniqueItems.findIndex((v) => v.code === code) !== -1) {
        continue;
      }

      uniqueItems.push({ ...item, code });
    }

    await this.sellerProducer.processSellerItemsScrapResult({
      brandId: brand.id,
      items: uniqueItems,
      pickkDiscountRate,
    });
  }

  async crawlItems(itemUrls: string[]): Promise<ItemInfoCrawlResult[]> {
    const MAX_CRAWL_COUNT = 70;
    const CRAWL_TERM = 1500;
    const items: (RejectResponse | FulfillResponse<ItemInfoCrawlResult>)[] = [];

    for (let i = 0; i < itemUrls.length; i += MAX_CRAWL_COUNT) {
      const result = await allSettled<ItemInfoCrawlResult>(
        itemUrls.slice(i, i + MAX_CRAWL_COUNT).map(
          (url) =>
            new Promise(async (resolve, reject) => {
              try {
                resolve(await this.crawlerProviderService.crawlInfo(url));
              } catch (err) {
                reject(err);
              }
            })
        )
      );
      items.push(...result);
      await new Promise((resolve) => setTimeout(resolve, CRAWL_TERM));
    }

    const fulfilledItems = items
      .filter(isFulfilled)
      .map((item: FulfillResponse<ItemInfoCrawlResult>) => item.value);
    return fulfilledItems;
  }

  @SqsConsumerEventHandler(SqsConsumerEvent.MESSAGE_RECEIVED)
  messageReceived(message: AWS.SQS.Message) {
    const { Body } = message;
    const { brand }: ScrapSellerItemsMto = JSON.parse(Body);
    this.logger.log(`scrapSellerItems received message brandId:${brand.id}`);
  }

  @SqsConsumerEventHandler(SqsConsumerEvent.MESSAGE_PROCESSED)
  messageProcessed(message: AWS.SQS.Message) {
    const { Body } = message;
    const { brand }: ScrapSellerItemsMto = JSON.parse(Body);
    this.logger.log(`scrapSellerItems processed message brandId:${brand.id}`);
  }

  @SqsConsumerEventHandler(SqsConsumerEvent.PROCESSING_ERROR)
  processingError(error: Error) {
    this.logger.log(error);
  }
}
