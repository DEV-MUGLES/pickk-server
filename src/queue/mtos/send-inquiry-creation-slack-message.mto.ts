import { Type } from 'class-transformer';

import { Inquiry } from '@item/inquiries/models';

export class SendInquiryCreationSlackMessageMto {
  @Type(() => Inquiry)
  inquiry: Inquiry;
}
