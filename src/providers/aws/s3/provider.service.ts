import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ReadStream } from 'fs-capacitor';
import moment from 'moment';

import { AwsS3ConfigService } from '@src/config/providers/aws/s3/config.service';

@Injectable()
export class AwsS3ProviderService {
  private ACL = 'public-read';
  private cloudfrontUrl: string;

  constructor(private readonly awsS3ConfigService: AwsS3ConfigService) {
    this.cloudfrontUrl = this.awsS3ConfigService.cloudfrontUrl;
    AWS.config.update({
      accessKeyId: this.awsS3ConfigService.accessKeyId,
      secretAccessKey: this.awsS3ConfigService.secretAccessKey,
      region: this.awsS3ConfigService.region,
    });
  }

  private getRandomString = (length = 6): string => {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  private getKey(filename: string, prefix?: string) {
    return `${moment().format('YYYYMMDD')}${
      prefix ? `/${prefix}` : ''
    }/${moment().format('hhmmss')}${this.getRandomString()}_${filename}`;
  }

  private cleanFilename(filename: string): string {
    const MAX_LENGTH = 50;

    return filename
      .replace(/[\\/:"*?<>| ]+/gi, '')
      .trim()
      .slice(Math.max(0, filename.length - MAX_LENGTH));
  }

  private getUrl(key: string) {
    return this.cloudfrontUrl + key;
  }

  async uploadStream(
    stream: ReadStream,
    filename: string,
    mimetype: string,
    prefix?: string
  ): Promise<{ url: string; key: string }> {
    const s3 = new AWS.S3();

    const params = {
      Bucket: this.awsS3ConfigService.publicBucketName,
      Key: this.getKey(this.cleanFilename(filename), prefix),
      Body: stream,
      ACL: this.ACL,
      ContentType: mimetype,
    };

    const key = await (await s3.upload(params).promise()).Key;

    return {
      key,
      url: this.getUrl(key),
    };
  }
}
