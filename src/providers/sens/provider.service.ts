import { Inject, Injectable } from '@nestjs/common';
import { AlimtalkClient, SmsClient } from 'nest-sens';

@Injectable()
export class SensService {
  constructor(
    @Inject(AlimtalkClient) private readonly alimtalkClient: AlimtalkClient,
    @Inject(SmsClient) private readonly smsClient: SmsClient
  ) {}

  async sendSms(to: string | string[], content: string) {
    await this.smsClient.send({ to, content });
  }
}
