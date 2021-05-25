import {
  parseResolveInfo,
  ResolveTree,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';
import { GraphQLResolveInfo } from 'graphql';

import { BaseIdEntity } from './entities/base.entity';

export type DerivedFieldsInfoType<T = unknown> = {
  [relationName: string]: Array<keyof T>;
};

export class BaseResolver<
  T extends BaseIdEntity = BaseIdEntity,
  RelationType extends string = string
> {
  protected relations: Array<RelationType> = [];
  protected derivedFieldsInfo: DerivedFieldsInfoType<T> = {};

  protected getSimplifiedInfo = (info: GraphQLResolveInfo) => {
    const parsedInfo = parseResolveInfo(info) as ResolveTree;
    return simplifyParsedResolveInfoFragmentWithType(
      parsedInfo,
      info.returnType
    );
  };

  protected getRelationsFromInfo(
    info: GraphQLResolveInfo,
    includes: RelationType[] = []
  ) {
    if (!info) {
      return [];
    }

    const simplifiedInfo = this.getSimplifiedInfo(info);
    const relations = this.relations.filter((relation) =>
      relation.split('.').some((chunk) => chunk in simplifiedInfo.fields)
    );

    Object.entries(this.derivedFieldsInfo).forEach(([relationName, fields]) => {
      if (fields.some((field) => field in simplifiedInfo.fields)) {
        relations.push(relationName as RelationType);
      }
    });

    return [...new Set(relations.concat(includes))];
  }
}
