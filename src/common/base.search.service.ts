import { SearchService } from '@providers/elasticsearch/provider.service';

import { PageInput } from './dtos';

export abstract class BaseSearchService<
  Model extends {
    id: number | string;
  },
  SearchBody extends {
    id: number | string;
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
    filter?: Partial<SearchBody>,
    sort?: (string | { [key: string]: 'asc' | 'desc' })[]
  ): Promise<{ ids: Model['id'][]; total: number }> {
    const searched = await this.searchService.search<SearchBody>(
      this.name,
      query,
      {
        from: pageInput?.offset ?? 0,
        size: pageInput?.limit ?? 20,
      },
      filter,
      sort
    );

    return {
      ids: searched.bodies.map((source) => source.id),
      total: searched.total,
    };
  }

  async enableFielddata(fieldName: string) {
    await this.searchService.enableFielddata(this.name, fieldName);
  }
}
