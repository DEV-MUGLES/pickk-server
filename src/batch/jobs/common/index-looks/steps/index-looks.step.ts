import { Injectable } from '@nestjs/common';

import { LookSearchService } from '@mcommon/search/look.search.service';
import { LooksService } from '@content/looks/looks.service';

@Injectable()
export class IndexLooksStep {
  constructor(
    private readonly looksService: LooksService,
    private readonly lookSearchService: LookSearchService
  ) {}

  async tasklet() {
    const looks = await this.looksService.list(null, null, [
      'user',
      'digests',
      'digests.item',
      'digests.item.brand',
      'digests.item.minorCategory',
      'styleTags',
    ]);
    await this.lookSearchService.bulkIndex(looks);
  }
}
