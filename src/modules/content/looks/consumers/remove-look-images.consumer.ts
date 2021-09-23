import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';

import { REMOVE_LOOK_IMAGES_QUEUE } from '@queue/constants';
import { RemoveDigestImagesMto } from '@queue/mtos';
import { BaseConsumer } from '@common/base.consumer';

import { ImagesService } from '@mcommon/images/images.service';

import { LookImagesRepository } from '../looks.repository';

@SqsProcess(REMOVE_LOOK_IMAGES_QUEUE)
export class RemoveLookImagesConsumer extends BaseConsumer {
  constructor(
    private readonly imagesService: ImagesService,
    @InjectRepository(LookImagesRepository)
    private readonly lookImagesRepository: LookImagesRepository,
    readonly logger: Logger
  ) {
    super();
  }

  @SqsMessageHandler()
  async removeImages(message: AWS.SQS.Message) {
    const { keys }: RemoveDigestImagesMto = JSON.parse(message.Body);

    await this.imagesService.removeByKeys(keys);
    await this.lookImagesRepository.delete(keys);
  }
}
