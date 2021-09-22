import { registerEnumType } from '@nestjs/graphql';

export enum LikeOwnerType {
  Digest = 'Digest',
  Look = 'Look',
  Video = 'Video',
  Comment = 'Comment',
  Keyword = 'Keyword',
}

registerEnumType(LikeOwnerType, {
  name: 'LikeOwnerType',
  description:
    '좋아요 대상 객체 분류입니다. (Digest, Look, Video, Comment, Keyword)',
});
