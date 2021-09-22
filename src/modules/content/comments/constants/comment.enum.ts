import { registerEnumType } from '@nestjs/graphql';

export enum CommentOwnerType {
  Digest = 'Digest',
  Look = 'Look',
  Video = 'Video',
}

registerEnumType(CommentOwnerType, {
  name: 'CommentOwnerType',
  description: '댓글 연관 객체 분류입니다.',
});
