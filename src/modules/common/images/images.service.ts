import { Inject, Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload';

import { AwsS3ProviderService } from '@providers/aws/s3';
import { S3UploadResultDto } from '@providers/aws/s3/dtos/s3.dto';

import { UploadBufferDto } from './dtos';
import { BaseImageRepository } from './base-image.repository';

@Injectable()
export class ImagesService {
  constructor(
    @Inject(BaseImageRepository)
    private baseImageRepository: BaseImageRepository,
    @Inject(AwsS3ProviderService) private awsS3Service: AwsS3ProviderService
  ) {}

  async insertBaseImages(keys: string[]) {
    await this.baseImageRepository.bulkInsert(keys);
  }

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

  /**
   * @param fileUploads
   * @returns result urls. failed file is null
   */
  async uploadFileUploads(
    fileUploads: Promise<FileUpload>[]
  ): Promise<Array<S3UploadResultDto | null>> {
    return await Promise.all<S3UploadResultDto | null>(
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
  }
}
