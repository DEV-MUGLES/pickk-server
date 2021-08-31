import {
  ForbiddenException,
  Inject,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { Args, Info, Int, Mutation, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtOrNotGuard, JwtVerifyGuard } from '@auth/guards';
import { JwtPayload } from '@auth/models';
import { IntArgs } from '@common/decorators';
import { PageInput } from '@common/dtos';
import { BaseResolver } from '@common/base.resolver';

import {
  CommentOwnerType,
  CommentRelationType,
  COMMENT_RELATIONS,
} from './constants';
import { CommentFilter, CreateCommentInput, UpdateCommentInput } from './dtos';
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

  @Query(() => Int)
  async commentsCount(
    @Args('ownerType') ownerType: CommentOwnerType,
    @IntArgs('ownerId') ownerId: number
  ): Promise<number> {
    return await this.commentsService.count(ownerType, ownerId);
  }

  @Query(() => [Comment])
  @UseGuards(JwtOrNotGuard)
  async comments(
    @CurrentUser() payload: JwtPayload,
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
      this.getRelationsFromInfo(info),
      payload?.sub
    );
  }

  @Mutation(() => Comment)
  @UseGuards(JwtVerifyGuard)
  async createComment(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('input') input: CreateCommentInput
  ): Promise<Comment> {
    return await this.commentsService.create(userId, input);
  }

  @Mutation(() => Comment)
  @UseGuards(JwtVerifyGuard)
  async updateComment(
    @CurrentUser() { sub: userId }: JwtPayload,
    @IntArgs('id') id: number,
    @Args('input') input: UpdateCommentInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Comment> {
    const isMine = await this.commentsService.checkBelongsTo(id, userId);
    if (!isMine) {
      throw new ForbiddenException('자신의 댓글이 아닙니다.');
    }

    await this.commentsService.update(id, input);
    return await this.commentsService.get(id, this.getRelationsFromInfo(info));
  }

  @Mutation(() => Comment)
  @UseGuards(JwtVerifyGuard)
  async deleteComment(
    @CurrentUser() { sub: userId }: JwtPayload,
    @IntArgs('id') id: number,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Comment> {
    const isMine = await this.commentsService.checkBelongsTo(id, userId);
    if (!isMine) {
      throw new ForbiddenException('자신의 댓글이 아닙니다.');
    }

    await this.commentsService.processDelete(id);
    return await this.commentsService.get(id, this.getRelationsFromInfo(info));
  }
}
