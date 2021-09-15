import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseStep } from '@batch/jobs/base.step';

import { ImagesService } from '@mcommon/images/images.service';
import { DigestImagesRepository } from '@content/digests/digests.repository';

@Injectable()
export class RemoveDeletedDigestImagesStep extends BaseStep {
  constructor(
    private readonly imagesService: ImagesService,
    @InjectRepository(DigestImagesRepository)
    private readonly digestImagesRepository: DigestImagesRepository
  ) {
    super();
  }

  async tasklet(): Promise<void> {
    const deletedDigestImages = await this.digestImagesRepository.find({
      digestId: null,
    });
    const deletedKeys = deletedDigestImages.map(({ key }) => key);
    await this.imagesService.removeByKeys(deletedKeys);
    await this.digestImagesRepository.remove(deletedDigestImages);
  }
}
