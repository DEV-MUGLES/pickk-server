import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AwsS3ProviderService } from '@src/providers/aws/s3/provider.service';

import { UploadImageInput } from './dto/image.input';
import { ImagesService } from './images.service';

@Resolver()
export class ImagesResolver {
  constructor(
    @Inject(ImagesService) private imagesService: ImagesService,
    @Inject(AwsS3ProviderService) private awsS3Service: AwsS3ProviderService
  ) {}

  @Mutation(() => [String])
  async uploadMultipleImages(
    @Args({
      name: 'uploadImageInput',
    })
    { files }: UploadImageInput
  ): Promise<Array<string | null>> {
    return await this.imagesService.uploadFileUploads(files);
  }
}
