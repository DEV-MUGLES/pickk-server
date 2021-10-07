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

  async index(id: number): Promise<void> {
    const model = await this.getModel(id);
    await this.searchService.index(
      this.indexName,
      this.typeName,
      this.toBody(model)
    );
  }

  async bulkIndex(models: Model[]): Promise<void> {
    await this.searchService.bulkIndex(
      this.indexName,
      this.typeName,
      models.map((model) => this.toBody(model))
    );
  }

  async update(id: number): Promise<void> {
    const model = await this.getModel(id);
    await this.searchService.update(
      this.indexName,
      this.typeName,
      id,
      this.toBody(model)
    );
  }

  async bulkUpdate(models: Model[]): Promise<void> {
    await this.searchService.bulkUpdate(
      this.indexName,
      this.typeName,
      models.map((model) => this.toBody(model))
    );
  }

  async remove(id: number): Promise<void> {
    await this.searchService.remove(this.indexName, this.typeName, id);
  }

  async search(
    query: string,
    pageInput?: PageInput,
    filter?: Partial<SearchBody>
  ): Promise<number[]> {
    const sources = await this.searchService.search<SearchBody>(
      this.indexName,
      this.typeName,
      query,
      {
        from: pageInput?.offset ?? 0,
        size: pageInput?.limit ?? 20,
      },
      filter
    );

    return sources.map((source) => source.id);
  }
}
