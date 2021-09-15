import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import {
  AwsS3ProviderService,
  S3DeleteResultDto,
  S3UploadResultDto,
} from '@providers/aws/s3';

import { UploadBufferDto } from './dtos';
import { getMimeType } from './helpers';

@Injectable()
export class ImagesService {
  constructor(
    private readonly httpService: HttpService,
    private awsS3Service: AwsS3ProviderService
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

  async uploadUrls(
    urls: string[],
    prefix?: string
  ): Promise<Array<S3UploadResultDto | null>> {
    const bufferDtos: UploadBufferDto[] = await Promise.all<UploadBufferDto>(
      urls.map(
        (url) =>
          new Promise(async (resolve) => {
            const { data: buffer } = await firstValueFrom(
              this.httpService.get<Buffer>(url, {
                responseType: 'arraybuffer',
              })
            );
            const mimetype = getMimeType(url);

            resolve({
              buffer,
              filename: `${new URL(url).pathname.slice(0, 10)}.${mimetype}`,
              mimetype,
              prefix,
            });
          })
      )
    );

    return await this.uploadBufferDatas(bufferDtos);
  }

  async removeByKeys(keys: string | string[]): Promise<S3DeleteResultDto> {
    return await this.awsS3Service.deleteObject(keys);
  }
}
