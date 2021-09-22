import { registerEnumType } from '@nestjs/graphql';

export enum KeywordClassType {
  TRENDING = 'TRENDING',
  ESSENTIAL = 'ESSENTIAL',
}

registerEnumType(KeywordClassType, {
  name: 'KeywordClassType',
});
