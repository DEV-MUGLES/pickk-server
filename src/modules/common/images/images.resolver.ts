import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { UploadImageInput } from './dto/image.input';
import { ImagesService } from './images.service';

@Resolver()
export class ImagesResolver {
  constructor(@Inject(ImagesService) private imagesService: ImagesService) {}

  @Mutation(() => [String])
  async uploadMultipleImages(
    @Args({
      name: 'uploadImageInput',
    })
    { files }: UploadImageInput
  ): Promise<Array<string | null>> {
    const results = await this.imagesService.uploadFileUploads(files);
    await this.imagesService.insertBaseImages(
      results.filter((v) => v).map((result) => result.key)
    );

    return results.map((result) => result?.url);
  }
}
