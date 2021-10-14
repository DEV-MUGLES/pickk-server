import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import { getSearchFilters } from './helpers';
import { SearchParams, SearchResult } from './types';

type BaseSearchBody = {
  id: number | string;
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

    for (let i = 0; i < bodies.length; i += CHUNK_SIZE) {
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
    query?: string,
    params?: SearchParams,
    filter?: Partial<SearchBody>,
    sort?: (string | { [key: string]: 'asc' | 'desc' })[]
  ): Promise<{ bodies: SearchBody[]; total: number }> {
    const { body } = await this.elasticsearchService.search<
      SearchResult<SearchBody>
    >({
      index: name,
      type: name,
      ...params,
      track_total_hits: true,
      body: {
        sort,
        query: {
          bool: {
            must: getSearchFilters(query, filter),
          },
        },
      },
    });

    return {
      bodies: body.hits.hits.map((hit) => hit._source),
      total: body.hits.total.value,
    };
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

  async enableFielddata(name: string, fieldName: string) {
    await this.elasticsearchService.indices.putMapping({
      index: name,
      body: {
        properties: {
          [fieldName]: {
            type: 'text',
            fielddata: true,
          },
        },
      },
    });
  }
}
