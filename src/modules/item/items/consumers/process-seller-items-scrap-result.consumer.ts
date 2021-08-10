import { Logger } from '@nestjs/common';
import {
  SqsConsumerEvent,
  SqsConsumerEventHandler,
  SqsMessageHandler,
  SqsProcess,
} from '@pickk/nestjs-sqs';

import { splitRegexString } from '@common/helpers';
import { PROCESS_SELLER_ITEMS_SCRAP_RESULT_QUEUE } from '@src/queue/constants';
import { ProcessSellerItemsScrapResultMto } from '@src/queue/mtos';

import { ItemFilter, UpdateByCrawlDatasDto, AddByCrawlDatasDto } from '../dtos';
import { ItemImageUrlProducer } from '../producers';

import { ItemsService } from '../items.service';

@SqsProcess(PROCESS_SELLER_ITEMS_SCRAP_RESULT_QUEUE)
export class ProcessSellerItemsScrapResultConsumer {
  constructor(
    private readonly itemsService: ItemsService,
    private readonly itemImageUrlProducer: ItemImageUrlProducer,
    private readonly logger: Logger
  ) {}

  @SqsMessageHandler()
  async processSellerResult(message: AWS.SQS.Message) {
    const { Body } = message;
    const { brandId, codeRegex, items }: ProcessSellerItemsScrapResultMto =
      JSON.parse(Body);
    const itemFilter = new ItemFilter();
    itemFilter.brandId = brandId;
    const existItems = await this.itemsService.list(itemFilter, null, [
      'prices',
    ]);
    const addByCrawlDatasDto: AddByCrawlDatasDto = new AddByCrawlDatasDto();
    const updateByCrawlDataDtos: UpdateByCrawlDatasDto =
      new UpdateByCrawlDatasDto();
    for (const itemData of items) {
      const [, code] = itemData.url.match(
        new RegExp(...splitRegexString(codeRegex))
      );
      const existIndex = existItems.findIndex((v) => v.providedCode === code);
      if (existIndex === -1) {
        addByCrawlDatasDto.datas.push({ brandId, code, ...itemData });
        continue;
      }
      updateByCrawlDataDtos.datas.push({
        item: existItems[existIndex],
        data: itemData,
      });
    }
    if (addByCrawlDatasDto.datas.length > 0) {
      await this.itemsService.addByCrawlDatas(addByCrawlDatasDto);
      for (const crawlData of addByCrawlDatasDto.datas) {
        const { brandId, code, imageUrl } = crawlData;
        await this.itemImageUrlProducer.update({ brandId, code, imageUrl });
      }
    }
    if (updateByCrawlDataDtos.datas.length > 0) {
      await this.itemsService.updateByCrawlDatas(updateByCrawlDataDtos);
    }
  }

  @SqsConsumerEventHandler(SqsConsumerEvent.MESSAGE_RECEIVED)
  messageReceived(message: AWS.SQS.Message) {
    const { Body } = message;
    const { items, brandId }: ProcessSellerItemsScrapResultMto =
      JSON.parse(Body);

    this.logger.log(
      `processSellerResult received message items:${items.length} brandId:${brandId}`
    );
  }

  @SqsConsumerEventHandler(SqsConsumerEvent.MESSAGE_PROCESSED)
  messageProcessed(message: AWS.SQS.Message) {
    const { Body } = message;
    const { items, brandId }: ProcessSellerItemsScrapResultMto =
      JSON.parse(Body);

    this.logger.log(
      `processSellerResult processed message item:${items.length} brandId:${brandId}`
    );
  }

  @SqsConsumerEventHandler(SqsConsumerEvent.ERROR)
  messageError(error: Error) {
    this.logger.error('processSellerResult error' + error);
  }

  @SqsConsumerEventHandler(SqsConsumerEvent.PROCESSING_ERROR)
  processingError(error: Error) {
    this.logger.error('processSellerResult processing error' + error);
  }
}
