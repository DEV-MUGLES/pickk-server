import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import { SearchParams, SearchResult } from './types';

type BaseSearchBody = {
  id: number;
};

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async index<SearchBody extends BaseSearchBody>(
    index: string,
    type: string,
    body: SearchBody
  ) {
    return await this.elasticsearchService.index<
      SearchResult<SearchBody>,
      SearchBody
    >({
      index,
      type,
      id: body.id.toString(),
      body,
    });
  }

  async bulkIndex<SearchBody extends BaseSearchBody>(
    index: string,
    type: string,
    bodies: SearchBody[]
  ) {
    return await this.elasticsearchService.bulk<SearchResult<SearchBody>>({
      refresh: true,
      body: bodies.reduce(
        (acc, body) => [
          ...acc,
          {
            index: {
              _index: index,
              _type: type,
              _id: body.id.toString(),
            },
          },
          body,
        ],
        []
      ),
    });
  }

  async bulkUpdate<SearchBody extends BaseSearchBody>(
    index: string,
    type: string,
    bodies: SearchBody[]
  ) {
    return await this.elasticsearchService.bulk<SearchResult<SearchBody>>({
      refresh: true,
      body: bodies.reduce(
        (acc, body) => [
          ...acc,
          {
            update: {
              _index: index,
              _type: type,
              _id: body.id.toString(),
            },
          },
          body,
        ],
        []
      ),
    });
  }

  /** 기본적으로 _score(관련도)순 정렬입니다. */
  async search<SearchBody extends BaseSearchBody>(
    index: string,
    type: string,
    query: string,
    params?: SearchParams
  ): Promise<SearchBody[]> {
    const { body } = await this.elasticsearchService.search<
      SearchResult<SearchBody>
    >({
      index,
      type,
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
    type: string,
    id: string | number,
    body: SearchBody
  ) {
    return await this.elasticsearchService.update<SearchBody>({
      index,
      type,
      id: id.toString(),
      body,
    });
  }

  async remove<SearchBody extends BaseSearchBody>(
    index: string,
    type: string,
    id: number | string
  ) {
    return await this.elasticsearchService.delete<SearchBody>({
      index,
      type,
      id: id.toString(),
    });
  }
}
