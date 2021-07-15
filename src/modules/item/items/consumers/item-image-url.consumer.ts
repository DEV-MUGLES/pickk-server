import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  SqsConsumerEvent,
  SqsConsumerEventHandler,
  SqsMessageHandler,
  SqsProcess,
} from '@pickk/nest-sqs';

import { ItemsService } from '@src/modules/item/items/items.service';
import { ImagesService } from '@src/modules/common/images/images.service';
import { getMimeType } from '@src/modules/common/images/helpers/image.helper';
import { UpdateItemImageUrlDto } from '../interfaces/item-image-url.interface';
import { UPDATE_ITEM_IMAGE_URL_QUEUE } from '../constants/item-image-url.constant';

@SqsProcess(UPDATE_ITEM_IMAGE_URL_QUEUE)
export class ItemImageUrlConsumer {
  constructor(
    private readonly httpService: HttpService,
    private readonly imagesService: ImagesService,
    private readonly itemsService: ItemsService
  ) {}

  @SqsMessageHandler()
  async update(message: AWS.SQS.Message): Promise<void> {
    const { Body } = message;
    const messageData: UpdateItemImageUrlDto = JSON.parse(Body);
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
