import { Injectable } from '@nestjs/common';

import { BaseSearchService } from '@common/base.search.service';
import { SearchService } from '@providers/elasticsearch/provider.service';

import { IKeyword } from '@content/keywords/interfaces';
import { Keyword } from '@content/keywords/models';
import { KeywordsService } from '@content/keywords/keywords.service';

export type KeywordSearchBody = Pick<IKeyword, 'id' | 'name' | 'content'> & {
  itemNames: string;
  brandNameKors: string;
  minorCategoryNames: string;
  styleTagNames: string;
};

@Injectable()
export class KeywordSearchService extends BaseSearchService<
  Keyword,
  KeywordSearchBody
> {
  typeName = 'keywords';

  constructor(
    readonly searchService: SearchService,
    private readonly keywordsService: KeywordsService
  ) {
    super();
  }

  async getModel(id: number): Promise<Keyword> {
    return this.keywordsService.get(id, [
      'styleTags',
      'digests',
      'digests.item',
      'digests.item.brand',
      'digests.item.minorCategory',
    ]);
  }

  toBody(keyword: Keyword): KeywordSearchBody {
    return {
      id: keyword.id,
      name: keyword.name,
      content: keyword.content,
      itemNames: keyword.digests.map((v) => v.item.name).join(', '),
      brandNameKors: keyword.digests
        .map((v) => v.item.brand.nameKor)
        .join(', '),
      minorCategoryNames: keyword.digests
        .map((v) => v.item.minorCategory?.name)
        .join(', '),
      styleTagNames: keyword.styleTags.map((v) => v.name).join(', '),
    };
  }
}
