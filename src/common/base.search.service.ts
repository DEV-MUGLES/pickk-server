import { SearchService } from '@providers/elasticsearch/provider.service';
import { SearchFieldDataType } from '@providers/elasticsearch/types';

import { PageInput } from './dtos';

type Id = number | string;

export abstract class BaseSearchService<
  Model extends {
    id: Id;
  },
  SearchBody extends {
    id: Id;
  }
> {
  abstract name: string;
  abstract searchService: SearchService;

  abstract getModel(id: Id): Promise<Model>;

  abstract toBody(model: Model): SearchBody;

  async index(id: Id): Promise<void> {
    const model = await this.getModel(id);
    await this.searchService.index(this.name, this.toBody(model));
  }

  async bulkIndex(models: Model[]): Promise<void> {
    await this.searchService.bulkIndex(
      this.name,
      models.map((model) => this.toBody(model))
    );
  }

  async update(id: Id): Promise<void> {
    const model = await this.getModel(id);
    await this.searchService.update(this.name, id, this.toBody(model));
  }

  async bulkUpdate(models: Model[]): Promise<void> {
    await this.searchService.bulkUpdate(
      this.name,
      models.map((model) => this.toBody(model))
    );
  }

  async bulkDelete(ids: Model['id'][]): Promise<void> {
    await this.searchService.bulkDelete(this.name, ids);
  }

  async remove(id: Id): Promise<void> {
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

  async putMapping(fieldName: string, type: SearchFieldDataType) {
    await this.searchService.putMapping(this.name, fieldName, type);
  }

  async clear() {
    await this.searchService.clear(this.name);
  }
}
