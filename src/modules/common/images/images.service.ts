import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import https from 'https';
import { firstValueFrom } from 'rxjs';

import { AwsS3ProviderService, S3UploadResultDto } from '@providers/aws/s3';

import { UploadBufferDto } from './dtos';
import { getMimeType, getS3Key } from './helpers';

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
          new Promise(async (resolve, reject) => {
            try {
              const { data: buffer } = await firstValueFrom(
                this.httpService.get<Buffer>(url, {
                  responseType: 'arraybuffer',
                  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
                })
              );
              const mimetype = getMimeType(url);

              resolve({
                buffer,
                filename: `${new URL(url).pathname.slice(0, 10)}.${mimetype}`,
                mimetype,
                prefix,
              });
            } catch (err) {
              reject(err);
            }
          })
      )
    );

    return await this.uploadBufferDatas(bufferDtos);
  }

  async removeByKeys(keys: string[]) {
    await this.awsS3Service.deleteObjects(keys);
  }

  async removeByUrls(urls: string[]) {
    await this.removeByKeys(urls.map((url) => getS3Key(url)));
  }
}
