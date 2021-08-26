import { Injectable } from '@nestjs/common';

import { BaseSearchService } from '@common/base.search.service';
import { SearchService } from '@providers/elasticsearch/provider.service';

import { IDigest } from './interfaces';
import { Digest } from './models';

import { DigestsService } from './digests.service';

export type DigestSearchBody = Pick<IDigest, 'id' | 'title'> & {
  userNickname: string;
  itemName: string;
  brandNameKor: string;
  minorCategoryName: string;
};

@Injectable()
export class DigestsSearchService extends BaseSearchService<DigestSearchBody> {
  indexName: 'digests';
  queryFields: [
    'title',
    'userNickname',
    'itemName',
    'brandNameKor',
    'minorCategoryName'
  ];

  constructor(
    readonly searchService: SearchService,
    private readonly digestsService: DigestsService
  ) {
    super();
  }

  async getDigest(id: number): Promise<Digest> {
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

  async index(id: number): Promise<void> {
    const digest = await this.getDigest(id);

    await this.searchService.index(this.indexName, this.toBody(digest));
  }

  async update(id: number): Promise<void> {
    const digest = await this.getDigest(id);

    await this.searchService.update(this.indexName, this.toBody(digest));
  }

  async remove(id: number): Promise<void> {
    await this.searchService.remove(this.indexName, id);
  }
}
