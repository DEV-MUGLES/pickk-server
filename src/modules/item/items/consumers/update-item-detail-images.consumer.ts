import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  SqsConsumerEvent,
  SqsConsumerEventHandler,
  SqsMessageHandler,
  SqsProcess,
} from '@pickk/nestjs-sqs';
import { firstValueFrom } from 'rxjs';

import { allSettled, FulfillResponse, isFulfilled } from '@common/helpers';
import { getMimeType } from '@mcommon/images/helpers';
import { UploadBufferDto } from '@mcommon/images/dtos';
import { ImagesService } from '@mcommon/images/images.service';
import { ItemsService } from '@item/items/items.service';
import { UPDATE_ITEM_DETAIL_IMAGES_QUEUE } from '@queue/constants';
import { UpdateItemDetailImagesMto } from '@queue/mtos';

import { ItemDetailImage } from '../models';

import { ItemsRepository } from '../items.repository';

@SqsProcess(UPDATE_ITEM_DETAIL_IMAGES_QUEUE)
export class UpdateItemDetailImagesConsumer {
  constructor(
    @InjectRepository(ItemsRepository)
    private readonly itemsRepository: ItemsRepository,
    private readonly httpService: HttpService,
    private readonly imagesService: ImagesService,
    private readonly itemsService: ItemsService,
    private readonly logger: Logger
  ) {}

  @SqsMessageHandler(true)
  async update(messages: AWS.SQS.Message[]): Promise<void> {
    const mtos: UpdateItemDetailImagesMto[] = messages.map(({ Body }) =>
      JSON.parse(Body)
    );

    await allSettled(
      mtos.map(
        (mto) =>
          new Promise(async (resolve) => {
            this.validateMto(mto);
            const { brandId, code, images, itemId } = mto;

            const item = await this.getItem(itemId, brandId, code);
            const uploadedDetailImages = await this.uploadDetailImages(
              images,
              item.id
            );
            item.detailImages = uploadedDetailImages;
            resolve(await this.itemsRepository.save(item));
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

  private async getItem(itemId: number, brandId: number, providedCode: string) {
    const findOption = itemId ? { id: itemId } : { brandId, providedCode };

    return await this.itemsService.findOne(findOption);
  }

  private async uploadDetailImages(imageUrls: string[], itemId: number) {
    const bufferDatas = await this.getImageBufferDatas(imageUrls);
    const uploadBufferDtos: UploadBufferDto[] = bufferDatas.map(
      ({ imageUrl, buffer }) => {
        const mimetype = getMimeType(imageUrl);
        return {
          buffer: buffer,
          filename: `DETAIL.${mimetype}`,
          mimetype,
          prefix: `item/${itemId}`,
        };
      }
    );

    return (await this.imagesService.uploadBufferDatas(uploadBufferDtos)).map(
      ({ url, key }) => new ItemDetailImage({ url, key })
    );
  }

  private async getImageBufferDatas(
    imageUrls: string[]
  ): Promise<{ imageUrl: string; buffer: Buffer }[]> {
    const settledBufferDatas = await allSettled(
      imageUrls.map(
        (imageUrl) =>
          new Promise(async (resolve, reject) => {
            try {
              const { data } = await firstValueFrom(
                this.httpService.get<Buffer>(imageUrl, {
                  responseType: 'arraybuffer',
                })
              );
              resolve({
                imageUrl,
                buffer: data,
              });
            } catch (err) {
              reject(err);
            }
          })
      )
    );
    return [].concat(
      ...settledBufferDatas
        .filter((data) => isFulfilled(data))
        .map((data) => (data as FulfillResponse).value)
    );
  }

  @SqsConsumerEventHandler(SqsConsumerEvent.PROCESSING_ERROR)
  processingError(error: Error) {
    this.logger.error(error);
  }
}
