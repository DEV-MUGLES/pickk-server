import { Injectable } from '@nestjs/common';
import { Query } from '@nestjs/graphql';

import { DIGESTS_EXHIBITION_RELATIONS } from './constants';
import { DigestsExhibition } from './models';

import { DigestsExhibitionsService } from './digests-exhibitions.service';

@Injectable()
export class DigestsExhibitionsResolver {
  constructor(
    private readonly digestsExhibitionsService: DigestsExhibitionsService
  ) {}

  @Query(() => [DigestsExhibition])
  async digestsExhibitions(): Promise<DigestsExhibition[]> {
    return await this.digestsExhibitionsService.list(
      DIGESTS_EXHIBITION_RELATIONS
    );
  }
}
