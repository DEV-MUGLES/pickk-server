import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { BaseSearchService } from '@common/base.search.service';
import { SearchService } from '@providers/elasticsearch/provider.service';

import { IKeyword } from './interfaces';
import { Keyword } from './models';

// import { KeywordsService } from './Keywords.service';

export type KeywordSearchBody = Pick<IKeyword, 'id' | 'name' | 'content'> & {
  itemNames: string;
  brandNameKors: string;
  minorCategoryNames: string;
  styleTagNames: string;
};

@Injectable()
export class KeywordsSearchService extends BaseSearchService<
  Keyword,
  KeywordSearchBody
> {
  indexName = 'keywords';

  constructor(
    readonly searchService: SearchService //, private readonly keywordsService: KeywordsService
  ) {
    super();
  }

  // @FIXME: keyword service를 inject하면 에러 발생함.. Nest.js 버그 같음
  async getModel(id: number): Promise<Keyword> {
    throw new InternalServerErrorException(
      `사용할 수 없습니다. 입력된ID:${id}`
    );
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
        .map((v) => v.item.minorCategory.name)
        .join(', '),
      styleTagNames: keyword.styleTags.map((v) => v.name).join(', '),
    };
  }
}
