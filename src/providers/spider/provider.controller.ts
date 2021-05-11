import { Controller, Get, HttpCode } from '@nestjs/common';

import { SpiderService } from './provider.service';

@Controller('/spider')
export class SpiderController {
  constructor(private readonly spiderService: SpiderService) {}

  @Get('/sellers')
  @HttpCode(200)
  async requestSellers(): Promise<void> {
    await this.spiderService.requestSellers();
  }

  @Get('/items')
  @HttpCode(200)
  async requestItems(): Promise<void> {
    return null;
  }
}
