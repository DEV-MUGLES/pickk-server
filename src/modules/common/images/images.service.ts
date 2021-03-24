import { Inject, Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload';

import { AwsS3ProviderService } from '@src/providers/aws/s3/provider.service';

@Injectable()
export class ImagesService {
  constructor(
    @Inject(AwsS3ProviderService) private awsS3Service: AwsS3ProviderService
  ) {}

  /**
   * @param fileUploads
   * @returns result urls. failed file is null
   */
  async uploadFileUploads(
    fileUploads: Promise<FileUpload>[]
  ): Promise<Array<string | null>> {
    return await Promise.all(
      fileUploads.map((fileUpload) =>
        new Promise<string>(async (resolve) => {
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
  }
}
