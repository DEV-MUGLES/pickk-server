import { SearchService } from '@providers/elasticsearch/provider.service';

import { PageInput } from './dtos';

export abstract class BaseSearchService<
  Model extends {
    id: number;
  },
  SearchBody extends {
    id: number;
  }
> {
  indexName = 'pickk';
  abstract typeName: string;
  abstract searchService: SearchService;

  abstract getModel(id: number): Promise<Model>;

  abstract toBody(model: Model): SearchBody;

  async refresh(): Promise<void> {
    await this.searchService.refresh(this.indexName);
  }

  async index(id: number): Promise<void> {
    const model = await this.getModel(id);
    await this.searchService.index(this.indexName, this.toBody(model));
  }

  async update(id: number): Promise<void> {
    const model = await this.getModel(id);
    await this.searchService.update(this.indexName, this.toBody(model));
  }

  async remove(id: number): Promise<void> {
    await this.searchService.remove(this.indexName, id);
  }

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
}
