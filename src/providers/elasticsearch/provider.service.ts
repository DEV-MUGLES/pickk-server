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
    name: string,
    body: SearchBody
  ) {
    return await this.elasticsearchService.index<
      SearchResult<SearchBody>,
      SearchBody
    >({
      index: name,
      type: name,
      id: body.id.toString(),
      body,
    });
  }

  async bulkIndex<SearchBody extends BaseSearchBody>(
    name: string,
    bodies: SearchBody[]
  ) {
    const CHUNK_SIZE = 3000;

    for (let i = 0; i < CHUNK_SIZE; i += CHUNK_SIZE) {
      await this.elasticsearchService.bulk<SearchResult<SearchBody>>({
        refresh: true,
        body: bodies.slice(i, i + CHUNK_SIZE).reduce(
          (acc, body) => [
            ...acc,
            {
              index: {
                _index: name,
                _type: name,
                _id: body.id.toString(),
              },
            },
            body,
          ],
          []
        ),
      });
    }
  }

  async bulkUpdate<SearchBody extends BaseSearchBody>(
    name: string,
    bodies: SearchBody[]
  ) {
    return await this.elasticsearchService.bulk<SearchResult<SearchBody>>({
      refresh: true,
      body: bodies.reduce(
        (acc, body) => [
          ...acc,
          {
            update: {
              _index: name,
              _type: name,
              _id: body.id.toString(),
            },
          },
          body,
        ],
        []
      ),
    });
  }

  async bulkDelete(name: string, ids: (number | string)[]) {
    return await this.elasticsearchService.bulk({
      refresh: true,
      body: ids.reduce(
        (acc, id) => [
          ...acc,
          {
            delete: {
              _index: name,
              _type: name,
              _id: id.toString(),
            },
          },
        ],
        []
      ),
    });
  }

  /** 기본적으로 _score(관련도)순 정렬입니다. */
  async search<SearchBody extends BaseSearchBody>(
    name: string,
    query: string,
    params?: SearchParams,
    filter?: Partial<SearchBody>
  ): Promise<SearchBody[]> {
    const { body } = await this.elasticsearchService.search<
      SearchResult<SearchBody>
    >({
      index: name,
      type: name,
      ...params,
      body: {
        query: {
          bool: {
            must: {
              multi_match: {
                query,
                type: 'phrase_prefix',
              },
            },
            ...(filter && {
              filter: {
                term: filter,
              },
            }),
          },
        },
      },
    });

    return body.hits.hits.map((hit) => hit._source);
  }

  async update<SearchBody extends BaseSearchBody>(
    name: string,
    id: string | number,
    body: SearchBody
  ) {
    return await this.elasticsearchService.update<SearchBody>({
      index: name,
      type: name,
      id: id.toString(),
      body,
    });
  }

  async remove<SearchBody extends BaseSearchBody>(
    name: string,
    id: number | string
  ) {
    return await this.elasticsearchService.delete<SearchBody>({
      index: name,
      type: name,
      id: id.toString(),
    });
  }
}
