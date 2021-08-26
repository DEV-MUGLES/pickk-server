import { Injectable } from '@nestjs/common';

import { BaseSearchService } from '@common/base.search.service';
import { SearchService } from '@providers/elasticsearch/provider.service';

import { IDigest } from '@content/digests/interfaces';
import { Digest } from '@content/digests/models';
import { DigestsService } from '@content/digests/digests.service';

export type DigestSearchBody = Pick<IDigest, 'id' | 'title'> & {
  userNickname: string;
  itemName: string;
  brandNameKor: string;
  minorCategoryName: string;
};

@Injectable()
export class DigestsSearchService extends BaseSearchService<
  Digest,
  DigestSearchBody
> {
  indexName = 'digests';

  constructor(
    readonly searchService: SearchService,
    private readonly digestsService: DigestsService
  ) {
    super();
  }

  async getModel(id: number): Promise<Digest> {
    return await this.digestsService.get(id, [
      'item',
      'item.brand',
      'item.minorCategory',
      'user',
    ]);
  }

  toBody(digest: Digest): DigestSearchBody {
    return {
      id: digest.id,
      title: digest.title,
      userNickname: digest.user.nickname,
      itemName: digest.item.name,
      brandNameKor: digest.item.brand.nameKor,
      minorCategoryName: digest.item.minorCategory?.name ?? '',
    };
  }
}
