import { registerEnumType } from '@nestjs/graphql';

export enum KeywordClassType {
  Trending = 'Trending',
  Essential = 'Essential',
}

registerEnumType(KeywordClassType, {
  name: 'KeywordClassType',
});
