import {
  parseResolveInfo,
  ResolveTree,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';
import { GraphQLResolveInfo } from 'graphql';

export class BaseResolver {
  protected relations = [];

  private getSimplifiedInfo = (info: GraphQLResolveInfo) => {
    const parsedInfo = parseResolveInfo(info) as ResolveTree;
    return simplifyParsedResolveInfoFragmentWithType(
      parsedInfo,
      info.returnType
    );
  };

  protected getRelationsFromInfo = (info: GraphQLResolveInfo) => {
    if (!info) {
      return [];
    }

    const simplifiedInfo = this.getSimplifiedInfo(info);
    return this.relations.filter(
      (relation) => relation in simplifiedInfo.fields
    );
  };
}
