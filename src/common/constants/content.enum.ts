import { registerEnumType } from '@nestjs/graphql';

export enum ContentType {
  Digest = 'Digest',
  Look = 'Look',
  Video = 'Video',
}

registerEnumType(ContentType, {
  name: 'ContentType',
  description: '컨텐츠 타입입니다.',
});
