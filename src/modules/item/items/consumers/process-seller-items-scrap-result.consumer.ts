import { Logger } from '@nestjs/common';
import {
  SqsConsumerEvent,
  SqsConsumerEventHandler,
  SqsMessageHandler,
  SqsProcess,
} from '@nestjs-packages/sqs';

import { PROCESS_SELLER_ITEMS_SCRAP_RESULT_QUEUE } from '@queue/constants';
import {
  ProcessSellerItemsScrapResultMto,
  UpdateItemImageUrlMto,
} from '@queue/mtos';

import {
  ItemFilter,
  UpdateByCrawlDatasDto,
  AddByCrawlDatasDto,
  ItemCrawlData,
  CreateItemInput,
} from '../dtos';
import { ItemsProducer } from '../producers';

import { ItemsService } from '../items.service';

@SqsProcess(PROCESS_SELLER_ITEMS_SCRAP_RESULT_QUEUE)
export class ProcessSellerItemsScrapResultConsumer {
  constructor(
    private readonly itemsService: ItemsService,
    private readonly itemsProducer: ItemsProducer,
    private readonly logger: Logger
  ) {}

  @SqsMessageHandler()
  async processSellerResult(message: AWS.SQS.Message) {
    const {
      brandId,
      items,
      pickkDiscountRate,
    }: ProcessSellerItemsScrapResultMto = JSON.parse(message.Body);

    const addByCrawlDatasDto = new AddByCrawlDatasDto();
    const updateByCrawlDatasDto = new UpdateByCrawlDatasDto();

    const existItems = await this.getExistItems(brandId);
    for (const itemData of items) {
      const { code } = itemData;
      const existIndex = existItems.findIndex((v) => v.providedCode === code);
      if (existIndex === -1) {
        addByCrawlDatasDto.crawlDatas.push({ brandId, code, ...itemData });
        continue;
      }
      updateByCrawlDatasDto.updateItemDatas.push({
        item: existItems[existIndex],
        itemData,
      });
    }

    await this.addItems(addByCrawlDatasDto, pickkDiscountRate);
    await this.updateItems(updateByCrawlDatasDto);
  }

  async getExistItems(brandId: number) {
    const itemFilter = new ItemFilter();
    itemFilter.brandId = brandId;
    return await this.itemsService.list(itemFilter, null, ['prices']);
  }

  private async addItems(
    addByCrawlDatasDto: AddByCrawlDatasDto,
    pickkDiscountRate: number
  ) {
    const { crawlDatas } = addByCrawlDatasDto;
    if (crawlDatas.length === 0) {
      return;
    }

    await this.itemsService.createMany(
      crawlDatas.map((crawlData) => ({
        ...CreateItemInput.create(crawlData, pickkDiscountRate),
        brandId: crawlData.brandId,
        providedCode: crawlData.code,
      }))
    );
    await this.updateItemImageUrl(crawlDatas);
  }

  private async updateItemImageUrl(crawlDatas: ItemCrawlData[]) {
    const updateItemImageUrlMtos = crawlDatas.map(
      (v): UpdateItemImageUrlMto => ({
        brandId: v.brandId,
        code: v.code,
        imageUrl: v.imageUrl,
      })
    );
    await this.itemsProducer.updateImageUrl(updateItemImageUrlMtos);
  }

  private async updateItems(updateByCrawlDatasDto: UpdateByCrawlDatasDto) {
    const { updateItemDatas } = updateByCrawlDatasDto;
    if (updateItemDatas.length === 0) {
      return;
    }

    await this.itemsService.updateByCrawlDatas(updateByCrawlDatasDto);
  }

  @SqsConsumerEventHandler(SqsConsumerEvent.MESSAGE_RECEIVED)
  messageReceived(message: AWS.SQS.Message) {
    const { items, brandId }: ProcessSellerItemsScrapResultMto = JSON.parse(
      message.Body
    );

    this.logger.log(
      `processSellerResult received message items:${items.length} brandId:${brandId}`
    );
  }

  @SqsConsumerEventHandler(SqsConsumerEvent.MESSAGE_PROCESSED)
  messageProcessed(message: AWS.SQS.Message) {
    const { items, brandId }: ProcessSellerItemsScrapResultMto = JSON.parse(
      message.Body
    );

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
