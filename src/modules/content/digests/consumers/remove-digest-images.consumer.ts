import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';

import { REMOVE_DIGEST_IMAGES_QUEUE } from '@queue/constants';
import { RemoveDigestImagesMto } from '@queue/mtos';
import { BaseConsumer } from '@common/base.consumer';

import { ImagesService } from '@mcommon/images/images.service';

import { DigestImagesRepository } from '../digests.repository';

@SqsProcess(REMOVE_DIGEST_IMAGES_QUEUE)
export class RemoveDigestImagesConsumer extends BaseConsumer {
  constructor(
    private readonly imagesService: ImagesService,
    @InjectRepository(DigestImagesRepository)
    private readonly digestImagesRepository: DigestImagesRepository,
    readonly logger: Logger
  ) {
    super();
  }

  @SqsMessageHandler()
  async removeImages(message: AWS.SQS.Message) {
    const { keys }: RemoveDigestImagesMto = JSON.parse(message.Body);
    if (keys.length === 0) {
      return;
    }
    await this.imagesService.removeByKeys(keys);
    await this.digestImagesRepository.delete(keys);
  }
}
