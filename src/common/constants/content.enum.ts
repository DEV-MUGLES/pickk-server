import { registerEnumType } from '@nestjs/graphql';

export enum ContentType {
  digest = 'digest',
  look = 'look',
  video = 'video',
}

registerEnumType(ContentType, {
  name: 'ContentType',
  description: '컨텐츠 타입입니다.',
});
