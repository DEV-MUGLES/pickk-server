import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import {
  SqsConsumerEvent,
  SqsConsumerEventHandler,
  SqsMessageHandler,
  SqsProcess,
} from '@pickk/nestjs-sqs';
import { firstValueFrom } from 'rxjs';

import { getMimeType } from '@mcommon/images/helpers';
import { ImagesService } from '@mcommon/images/images.service';
import { ItemsService } from '@item/items/items.service';
import { UPDATE_ITEM_IMAGE_URL_QUEUE } from '@queue/constants';
import { UpdateItemImageUrlMto } from '@queue/mtos';

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
    const mto: UpdateItemImageUrlMto = JSON.parse(message.Body);
    this.validateMto(mto);
    const { brandId, code, imageUrl, itemId } = mto;

    const item = await this.getItem(itemId, brandId, code);
    const uploadedImageUrl = await this.uploadImageUrl(imageUrl, item.id);

    await this.itemsService.update(item, {
      imageUrl: uploadedImageUrl,
    });
  }

  private validateMto(mto: UpdateItemImageUrlMto) {
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

  private async getItem(itemId: number, brandId: number, providedCode: string) {
    const findOption = itemId ? { id: itemId } : { brandId, providedCode };

    return await this.itemsService.findOne(findOption);
  }

  private async uploadImageUrl(imageUrl: string, itemId: number) {
    const { data: buffer } = await firstValueFrom(
      this.httpService.get<Buffer>(imageUrl, {
        responseType: 'arraybuffer',
      })
    );
    const mimetype = getMimeType(imageUrl);
    return (
      await this.imagesService.uploadBufferDatas([
        {
          buffer,
          filename: `THUMBNAIL.${mimetype}`,
          mimetype,
          prefix: `item/${itemId}`,
        },
      ])
    )[0].url;
  }

  @SqsConsumerEventHandler(SqsConsumerEvent.PROCESSING_ERROR)
  processingError(error: Error) {
    this.logger.error(error);
  }
}
