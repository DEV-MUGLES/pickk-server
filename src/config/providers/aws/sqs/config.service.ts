import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Service dealing with mysql config based operations.
 *
 * @class
 */
@Injectable()
export class AwsSqsConfigService {
  constructor(private configService: ConfigService) {}

  get region(): string {
    return this.configService.get<string>('aws-sqs.region');
  }
  get accessKeyId(): string {
    return this.configService.get<string>('aws-sqs.accessKeyId');
  }
  get secretAccessKey(): string {
    return this.configService.get<string>('aws-sqs.secretAccessKey');
  }
  get endpoint(): string {
    return this.configService.get<string>('aws-sqs.endpoint');
  }
  get accountNumber(): string {
    return this.configService.get<string>('aws-sqs.accountNumber');
  }
}
