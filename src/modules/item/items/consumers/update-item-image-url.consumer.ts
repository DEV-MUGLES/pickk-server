import { Logger } from '@nestjs/common';
import {
  SqsConsumerEvent,
  SqsConsumerEventHandler,
  SqsMessageHandler,
  SqsProcess,
} from '@pickk/nestjs-sqs';

import { UPDATE_ITEM_IMAGE_URL_QUEUE } from '@queue/constants';
import { UpdateItemImageUrlMto } from '@queue/mtos';

import { ImagesService } from '@mcommon/images/images.service';
import { ItemsService } from '@item/items/items.service';

@SqsProcess(UPDATE_ITEM_IMAGE_URL_QUEUE)
export class UpdateItemImageUrlConsumer {
  constructor(
    private readonly imagesService: ImagesService,
    private readonly itemsService: ItemsService,
    private readonly logger: Logger
  ) {}

  @SqsMessageHandler()
  async update(message: AWS.SQS.Message): Promise<void> {
    const mto: UpdateItemImageUrlMto = JSON.parse(message.Body);

    this.validateMto(mto);

    const item = await this.getItem(mto);

    const uploadedImageUrl = (
      await this.imagesService.uploadUrls([mto.imageUrl], `item/${item.id}`)
    )[0].url;
    await this.itemsService.update(item.id, {
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

  private async getItem({ itemId, brandId, code }: UpdateItemImageUrlMto) {
    const findOption = itemId
      ? { id: itemId }
      : { brandId, providedCode: code };

    return await this.itemsService.findOne(findOption);
  }

  @SqsConsumerEventHandler(SqsConsumerEvent.PROCESSING_ERROR)
  processingError(error: Error) {
    this.logger.error(error);
  }
}
