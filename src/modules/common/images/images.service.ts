import { Inject, Injectable } from '@nestjs/common';

import { AwsS3ProviderService } from '@providers/aws/s3';
import { S3UploadResultDto } from '@providers/aws/s3/dtos/s3.dto';

import { UploadBufferDto } from './dtos';

@Injectable()
export class ImagesService {
  constructor(
    @Inject(AwsS3ProviderService) private awsS3Service: AwsS3ProviderService
  ) {}

  async uploadBufferDatas(
    uploadBufferDtos: UploadBufferDto[]
  ): Promise<Array<S3UploadResultDto | null>> {
    return await Promise.all<S3UploadResultDto | null>(
      uploadBufferDtos.map((uploadBufferDto) =>
        new Promise<{ url: string; key: string }>(async (resolve) => {
          const { buffer, mimetype, filename, prefix } = uploadBufferDto;
          resolve(
            await this.awsS3Service.uploadBuffer(
              buffer,
              filename,
              mimetype,
              prefix
            )
          );
        }).catch(() => null)
      )
    );
  }
}
