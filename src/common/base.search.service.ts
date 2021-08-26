import { SearchService } from '@providers/elasticsearch/provider.service';

import { PageInput } from './dtos';

export abstract class BaseSearchService<
  SearchBody extends {
    id: number;
  }
> {
  abstract indexName: string;
  abstract searchService: SearchService;

  abstract toBody(data: { id: number }): SearchBody;

  abstract index(id: number): Promise<void>;

  async search(query: string, pageInput: PageInput): Promise<number[]> {
    const sources = await this.searchService.search<SearchBody>(
      this.indexName,
      query,
      {
        from: pageInput?.offset ?? 0,
        size: pageInput?.limit ?? 20,
      }
    );

    return sources.map((source) => source.id);
  }

  abstract update(id: number): Promise<void>;

  abstract remove(id: number): Promise<void>;
}
