import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import {
  SqsConsumerEvent,
  SqsConsumerEventHandler,
  SqsMessageHandler,
  SqsProcess,
} from '@pickk/nestjs-sqs';
import { firstValueFrom } from 'rxjs';

import { getMimeType } from '@src/modules/common/images/helpers';
import { ImagesService } from '@src/modules/common/images/images.service';
import { UPDATE_ITEM_IMAGE_URL_QUEUE } from '@src/queue/constants';
import { UpdateItemImageUrlMto } from '@src/queue/mtos';
import { ItemsService } from '@item/items/items.service';

@SqsProcess(UPDATE_ITEM_IMAGE_URL_QUEUE)
export class UpdateItemImageUrlConsumer {
  constructor(
    private readonly httpService: HttpService,
    private readonly imagesService: ImagesService,
    private readonly itemsService: ItemsService,
    private readonly logger: Logger
  ) {}

  @SqsMessageHandler()
  async update(message: AWS.SQS.Message): Promise<void> {
    const { Body } = message;
    const mto: UpdateItemImageUrlMto = JSON.parse(Body);
    this.validateMto(mto);

    const { brandId, code, imageUrl, itemId } = mto;
    const { data } = await firstValueFrom(
      this.httpService.get<Buffer>(imageUrl, {
        responseType: 'arraybuffer',
      })
    );
    const findOption = itemId
      ? { id: itemId }
      : { brandId, providedCode: code };

    const item = await this.itemsService.findOne(findOption);

    const mimetype = getMimeType(imageUrl);
    const [result] = await this.imagesService.uploadBufferDatas([
      {
        buffer: data,
        filename: `THUMBNAIL.${mimetype}`,
        mimetype: mimetype,
        prefix: `item/${item.id}`,
      },
    ]);

    await this.itemsService.update(item, {
      imageUrl: result.url,
    });
  }

  validateMto(mto: UpdateItemImageUrlMto) {
    const { itemId, brandId, code } = mto;

    if (itemId === undefined && brandId === undefined) {
      throw new Error(
        'itemId가 undefined이면, brandId와 code를 입력받아야 합니다'
      );
    }
    if (brandId === undefined || code === undefined) {
      throw new Error('brandId와 code 둘 다 입력받아야 합니다.');
    }
  }

  @SqsConsumerEventHandler(SqsConsumerEvent.PROCESSING_ERROR)
  processingError(error: Error) {
    this.logger.error(error);
  }
}
