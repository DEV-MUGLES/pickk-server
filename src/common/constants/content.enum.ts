import { registerEnumType } from '@nestjs/graphql';

export enum ContentType {
  DIGEST = 'DIGEST',
  LOOK = 'LOOK',
  VIDEO = 'VIDEO',
}

registerEnumType(ContentType, {
  name: 'ContentType',
  description: '컨텐츠 타입입니다.',
});
