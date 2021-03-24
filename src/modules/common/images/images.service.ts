import { Inject, Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload';

import { AwsS3ProviderService } from '@src/providers/aws/s3/provider.service';

import { BaseImageRepository } from './base-image.repository';

@Injectable()
export class ImagesService {
  constructor(
    @Inject(BaseImageRepository)
    private baseImageRepository: BaseImageRepository,
    @Inject(AwsS3ProviderService) private awsS3Service: AwsS3ProviderService
  ) {}

  /**
   * @param fileUploads
   * @returns result urls. failed file is null
   */
  async uploadFileUploads(
    fileUploads: Promise<FileUpload>[]
  ): Promise<Array<string | null>> {
    const results = await Promise.all(
      fileUploads.map((fileUpload) =>
        new Promise<{ url: string; key: string }>(async (resolve) => {
          const { filename, mimetype, createReadStream } = await fileUpload;
          resolve(
            await this.awsS3Service.uploadStream(
              createReadStream(),
              filename,
              mimetype
            )
          );
        }).catch(() => null)
      )
    );
    this.baseImageRepository.bulkInsert(results.map((result) => result.key));

    return results.map((result) => result.url);
  }
}
