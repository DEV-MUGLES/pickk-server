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
  abstract name: string;
  abstract searchService: SearchService;

  abstract getModel(id: number): Promise<Model>;

  abstract toBody(model: Model): SearchBody;

  async index(id: number): Promise<void> {
    const model = await this.getModel(id);
    await this.searchService.index(this.name, this.toBody(model));
  }

  async bulkIndex(models: Model[]): Promise<void> {
    await this.searchService.bulkIndex(
      this.name,
      models.map((model) => this.toBody(model))
    );
  }

  async update(id: number): Promise<void> {
    const model = await this.getModel(id);
    await this.searchService.update(this.name, id, this.toBody(model));
  }

  async bulkUpdate(models: Model[]): Promise<void> {
    await this.searchService.bulkUpdate(
      this.name,
      models.map((model) => this.toBody(model))
    );
  }

  async bulkDelete(ids: (number | string)[]): Promise<void> {
    await this.searchService.bulkDelete(this.name, ids);
  }

  async remove(id: number): Promise<void> {
    await this.searchService.remove(this.name, id);
  }

  async search(
    query: string,
    pageInput?: PageInput,
    filter?: Partial<SearchBody>
  ): Promise<number[]> {
    const sources = await this.searchService.search<SearchBody>(
      this.name,
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
