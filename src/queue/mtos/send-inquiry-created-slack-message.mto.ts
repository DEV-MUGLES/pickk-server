import { Type } from 'class-transformer';

import { Inquiry } from '@item/inquiries/models';

export class SendInquiryCreatedSlackMessageMto {
  @Type(() => Inquiry)
  inquiry: Inquiry;
}
