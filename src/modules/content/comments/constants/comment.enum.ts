import { registerEnumType } from '@nestjs/graphql';

export enum CommentOwnerType {
  DIGEST = 'DIGEST',
  LOOK = 'LOOK',
  VIDEO = 'VIDEO',
}

registerEnumType(CommentOwnerType, {
  name: 'CommentOwnerType',
  description: '댓글 연관 객체 분류입니다.',
});
