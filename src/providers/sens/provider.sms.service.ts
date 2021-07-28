import { Inject, Injectable } from '@nestjs/common';
import { SmsClient } from 'nest-sens';

import { createPinTemplate } from '@templates/sms';

@Injectable()
export class SmsService {
  constructor(@Inject(SmsClient) private readonly smsClient: SmsClient) {}

  async sendPin(to: string, code: string) {
    await this.smsClient.send({ to, content: createPinTemplate(code) });
  }
}
