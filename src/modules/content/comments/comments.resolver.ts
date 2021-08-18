import { Inject, Injectable } from '@nestjs/common';
import { Args, Info, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { PageInput } from '@common/dtos';
import { BaseResolver } from '@common/base.resolver';

import { CommentRelationType, COMMENT_RELATIONS } from './constants';
import { CommentFilter } from './dtos';
import { Comment } from './models';

import { CommentsService } from './comments.service';

@Injectable()
export class CommentsResolver extends BaseResolver<CommentRelationType> {
  relations = COMMENT_RELATIONS;

  constructor(
    @Inject(CommentsService) private readonly commentsService: CommentsService
  ) {
    super();
  }

  @Query(() => [Comment])
  async comments(
    @Args('filter', {
      description: '기본적으로 parentIdIsNull:true가 적용되어있습니다.',
      nullable: true,
    })
    filter?: CommentFilter,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Comment[]> {
    return await this.commentsService.list(
      {
        parentIdIsNull: true,
        ...filter,
      },
      pageInput,
      this.getRelationsFromInfo(info)
    );
  }
}
