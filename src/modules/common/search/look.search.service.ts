import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { BaseSearchService } from '@common/base.search.service';
import { SearchService } from '@providers/elasticsearch';

import { ILook } from '@content/looks/interfaces';
import { Look } from '@content/looks/models';
// import { LooksService } from '@content/looks/Looks.service';

export type LookSearchBody = Pick<ILook, 'id' | 'title'> & {
  userNickname: string;
  itemNames: string;
  brandNameKors: string;
  minorCategoryNames: string;
  styleTagNames: string;
};

@Injectable()
export class LookSearchService extends BaseSearchService<Look, LookSearchBody> {
  name = 'looks';

  constructor(
    readonly searchService: SearchService // private readonly looksService: LooksService
  ) {
    super();
  }

  async getModel(/* id: number */): Promise<Look> {
    throw new InternalServerErrorException(
      '미구현 상태입니다. SearchService를 직접 이용하세요.'
    );
    return null;
    // return await this.looksService.get(id, [
    //   'digests',
    //   'digests.item',
    //   'digests.item.brand',
    //   'digests.item.minorCategory',
    //   'user',
    //   'styleTags',
    // ]);
  }

  toBody(look: Look): LookSearchBody {
    return {
      id: look.id,
      title: look.title,
      userNickname: look.user.nickname,
      itemNames: look.digests.map((v) => v.item.name).join(', '),
      brandNameKors: look.digests.map((v) => v.item.brand.nameKor).join(', '),
      minorCategoryNames:
        look.digests
          .map((v) => v.item.minorCategory?.name)
          .filter((v) => v)
          .join(', ') || '',
      styleTagNames: look.styleTags.map((v) => v.name).join(', ') || '',
    };
  }
}
