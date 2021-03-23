import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { UploadImageInput } from './dto/image.input';

@Resolver()
export class ImagesResolver {
  @Mutation(() => Boolean)
  async uploadMultipleImages(
    @Args({
      name: 'uploadImageInput',
      type: () => UploadImageInput,
    })
    { files }: UploadImageInput
  ): Promise<boolean> {
    const { createReadStream } = await files[0];
    const stream = createReadStream();
    // Promisify the stream and store the file, then…
    return true;
  }
}
