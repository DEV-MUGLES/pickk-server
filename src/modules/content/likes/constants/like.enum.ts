import { registerEnumType } from '@nestjs/graphql';

export enum LikeOwnerType {
  Digest = 'digest',
  Look = 'look',
  Video = 'video',
  Comment = 'comment',
  Keyword = 'keyword',
}

registerEnumType(LikeOwnerType, {
  name: 'LikeOwnerType',
  description:
    '좋아요 대상 객체 분류입니다. (Digest, Look, Video, Comment, Keyword)',
});
