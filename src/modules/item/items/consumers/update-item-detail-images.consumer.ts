import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';

import { BaseConsumer } from '@common/base.consumer';
import { ImagesService } from '@mcommon/images/images.service';
import { UPDATE_ITEM_DETAIL_IMAGES_QUEUE } from '@queue/constants';
import { UpdateItemDetailImagesMto } from '@queue/mtos';

import { ItemsService } from '@item/items/items.service';

import { ItemDetailImageFactory } from '../factories';
import { getItemDetailImageS3Prefix } from '../helpers';

import { ItemsRepository } from '../items.repository';

@SqsProcess(UPDATE_ITEM_DETAIL_IMAGES_QUEUE)
export class UpdateItemDetailImagesConsumer extends BaseConsumer {
  constructor(
    @InjectRepository(ItemsRepository)
    private readonly itemsRepository: ItemsRepository,
    private readonly imagesService: ImagesService,
    private readonly itemsService: ItemsService,
    readonly logger: Logger
  ) {
    super();
  }

  @SqsMessageHandler(true)
  async update(messages: AWS.SQS.Message[]): Promise<void> {
    const mtos: UpdateItemDetailImagesMto[] = messages.map(({ Body }) =>
      JSON.parse(Body)
    );

    await Promise.all(
      mtos.map(
        (mto) =>
          new Promise(async (resolve) => {
            this.validateMto(mto);
            const item = await this.getItem(mto);
            const uploadedDetailImages = await this.uploadDetailImages(
              mto.images,
              item.id
            );
            item.detailImages = uploadedDetailImages;
            const updatedItem = await this.itemsRepository.save(item);
            resolve(updatedItem);
          })
      )
    );
  }

  private validateMto(mto: UpdateItemDetailImagesMto) {
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

  private async getItem({ itemId, brandId, code }: UpdateItemDetailImagesMto) {
    const findOption = itemId
      ? { id: itemId }
      : { brandId, providedCode: code };

    return await this.itemsService.findOne(findOption);
  }

  private async uploadDetailImages(imageUrls: string[], itemId: number) {
    return (
      await this.imagesService.uploadUrls(imageUrls, getItemDetailImageS3Prefix(itemId))
    ).map(({ url },index) => ItemDetailImageFactory.from(url,index));
  }
}
