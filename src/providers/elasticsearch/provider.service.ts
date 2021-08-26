import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import { getUpdateScript } from './helpers';
import { SearchParams, SearchResult } from './types';

type BaseSearchBody = {
  id: number;
};

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async index<SearchBody extends BaseSearchBody>(
    index: string,
    body: SearchBody
  ) {
    return await this.elasticsearchService.index<
      SearchResult<SearchBody>,
      SearchBody
    >({
      index,
      body,
    });
  }

  /** 기본적으로 _score(관련도)순 정렬입니다. */
  async search<SearchBody extends BaseSearchBody>(
    index: string,
    query: string,
    params?: SearchParams
  ): Promise<SearchBody[]> {
    const { body } = await this.elasticsearchService.search<
      SearchResult<SearchBody>
    >({
      index,
        ...params,
      body: {
        query: {
          multi_match: {
            query,
          },
        },
      },
    });

    return body.hits.hits.map((hit) => hit._source);
  }

  async update<SearchBody extends BaseSearchBody>(
    index: string,
    body: SearchBody
  ) {
    return await this.elasticsearchService.updateByQuery<SearchBody>({
      index,
      body: {
        query: {
          match: {
            id: body.id,
          },
        },
        script: {
          inline: getUpdateScript(body),
        },
      },
    });
  }

  async remove<SearchBody extends BaseSearchBody>(index: string, id: number) {
    return await this.elasticsearchService.deleteByQuery<SearchBody>({
      index,
      body: {
        query: {
          match: { id },
        },
      },
    });
  }
}
