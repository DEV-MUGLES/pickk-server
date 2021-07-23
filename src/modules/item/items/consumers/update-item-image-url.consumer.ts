import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  SqsConsumerEvent,
  SqsConsumerEventHandler,
  SqsMessageHandler,
  SqsProcess,
} from '@pickk/nestjs-sqs';

import { getMimeType } from '@src/modules/common/images/helpers';
import { ImagesService } from '@src/modules/common/images/images.service';
import { ItemsService } from '@item/items/items.service';

import { UPDATE_ITEM_IMAGE_URL_QUEUE } from '../constants';
import { UpdateItemImageUrlMto } from '../mtos';

@SqsProcess(UPDATE_ITEM_IMAGE_URL_QUEUE)
export class UpdateItemImageUrlConsumer {
  constructor(
    private readonly httpService: HttpService,
    private readonly imagesService: ImagesService,
    private readonly itemsService: ItemsService
  ) {}

  @SqsMessageHandler()
  async update(message: AWS.SQS.Message): Promise<void> {
    const { Body } = message;
    const messageData: UpdateItemImageUrlMto = JSON.parse(Body);
    const { itemId, imageUrl } = messageData;

    const { data } = await firstValueFrom(
      this.httpService.get<Buffer>(imageUrl, {
        responseType: 'arraybuffer',
      })
    );

    const mimetype = getMimeType(imageUrl);
    const [result] = await this.imagesService.uploadBufferDatas([
      {
        buffer: data,
        filename: `THUMBNAIL.${mimetype}`,
        mimetype: mimetype,
        prefix: `item/${itemId}`,
      },
    ]);

    const item = await this.itemsService.get(itemId);
    await this.itemsService.update(item, {
      imageUrl: result.url,
    });
  }

  @SqsConsumerEventHandler(SqsConsumerEvent.PROCESSING_ERROR)
  processingError(error) {
    console.log(error);
  }
}
