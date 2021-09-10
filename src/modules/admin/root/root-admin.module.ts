import { Module } from '@nestjs/common';

import { RootInquiryModule } from './item/inquiry/root-inquiry.module';

@Module({
  imports: [RootInquiryModule],
})
export class RootAdminModule {}
