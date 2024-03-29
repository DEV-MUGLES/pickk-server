import { Injectable } from '@nestjs/common';
import { SqsService } from '@nestjs-packages/sqs';

import { getRandomUuid } from '@common/helpers';
import {
  SCRAP_SELLER_ITEMS_QUEUE,
  PROCESS_SELLER_ITEMS_SCRAP_RESULT_QUEUE,
  MAX_SQS_MESSAGE_SIZE,
} from '@queue/constants';
import {
  ProcessSellerItemsScrapResultMto,
  ScrapSellerItemsMto,
} from '@queue/mtos';

@Injectable()
export class SellerProducer {
  constructor(private readonly sqsService: SqsService) {}

  async scrapSellerItems(mto: ScrapSellerItemsMto) {
    await this.sqsService.send<ScrapSellerItemsMto>(SCRAP_SELLER_ITEMS_QUEUE, {
      id: getRandomUuid(),
      body: mto,
    });
  }

  async processSellerItemsScrapResult(mto: ProcessSellerItemsScrapResultMto) {
    const splitedMtos = this.splitProcessSellerItemsScrapResultMto(mto);
    for (const mto of splitedMtos) {
      await this.sqsService.send<ProcessSellerItemsScrapResultMto>(
        PROCESS_SELLER_ITEMS_SCRAP_RESULT_QUEUE,
        {
          id: getRandomUuid(),
          body: mto,
        }
      );
    }
  }

  /**
   * processSellerItemsScrapResult의 입력으로 들어온 mto를 SQS Message의 최대 사이즈(256KB)가 넘지 않도록
   * 쪼개어 반환해주는 함수입니다.
   * @param mto processSellerItemsScrapResult의 message
   * @returns 입력받은 mto를 256KB보다 작게 쪼개어 배열 형식으로 반환합니다.
   */
  splitProcessSellerItemsScrapResultMto(
    mto: ProcessSellerItemsScrapResultMto
  ): ProcessSellerItemsScrapResultMto[] {
    const messageSize = JSON.stringify(mto).length * 2;
    const messageChunk = Math.ceil(messageSize / MAX_SQS_MESSAGE_SIZE);

    if (messageChunk <= 1) {
      return [mto];
    }

    const { brandId, items, pickkDiscountRate } = mto;
    const itemsChunkSize = Math.round(items.length / messageChunk);
    const splitedMtos: ProcessSellerItemsScrapResultMto[] = [];

    for (let i = 0; i < messageChunk + 1; i++) {
      splitedMtos.push({
        brandId,
        items: items.slice(itemsChunkSize * i, itemsChunkSize * (i + 1)),
        pickkDiscountRate,
      });
    }
    return splitedMtos;
  }
}
