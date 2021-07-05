import { registerEnumType } from '@nestjs/graphql';

export enum ContentType {
  Pickk = 'Pickk',
  Look = 'Look',
}

registerEnumType(ContentType, {
  name: 'ContentType',
  description: '컨텐츠 타입입니다.',
});
