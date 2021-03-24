import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Service dealing with mysql config based operations.
 *
 * @class
 */
@Injectable()
export class AwsS3ConfigService {
  constructor(private configService: ConfigService) {}

  get region(): string {
    return this.configService.get<string>('aws-s3.region');
  }
  get accessKeyId(): string {
    return this.configService.get<string>('aws-s3.accessKeyId');
  }
  get secretAccessKey(): string {
    return this.configService.get<string>('aws-s3.secretAccessKey');
  }
  get publicBucketName(): string {
    return this.configService.get<string>('aws-s3.publicBucketName');
  }
  get cloudfrontUrl(): string {
    return this.configService.get<string>('aws-s3.cloudfrontUrl');
  }
}
