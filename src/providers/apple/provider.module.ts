import { HttpModule, Module } from '@nestjs/common';

import { AppleConfigModule } from '@config/providers/apple/config.module';

import { AppleProviderService } from './provider.service';

@Module({
  imports: [HttpModule, AppleConfigModule],
  providers: [AppleProviderService],
  exports: [AppleProviderService],
})
export class AppleProviderModule {}
