import { registerEnumType } from '@nestjs/graphql';

export enum LikeOwnerType {
  DIGEST = 'DIGEST',
  LOOK = 'LOOK',
  VIDEO = 'VIDEO',
  COMMENT = 'COMMENT',
  KEYWORD = 'KEYWORD',
}

registerEnumType(LikeOwnerType, {
  name: 'LikeOwnerType',
  description:
    '좋아요 대상 객체 분류입니다. (Digest, Look, Video, Comment, Keyword)',
});
