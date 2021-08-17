import { registerEnumType } from '@nestjs/graphql';

export enum CommentOwnerType {
  Digest = 'digest',
  Look = 'look',
  Video = 'video',
}

registerEnumType(CommentOwnerType, {
  name: 'CommentOwnerType',
  description: '댓글 연관 객체 분류입니다.',
});
