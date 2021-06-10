import {
  FieldsByTypeName,
  parseResolveInfo,
  ResolveTree,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';
import { GraphQLResolveInfo } from 'graphql';

import { BaseIdEntity } from './entities/base.entity';

export type DerivedFieldsInfoType<T = unknown> = {
  [relationName: string]: Array<keyof T>;
};
declare type mixed =
  | Record<string, any>
  | string
  | number
  | boolean
  | undefined
  | null;

export type SimplifiedInfo = {
  fields: Record<string, any>;
  name: string;
  alias: string;
  args: {
    [str: string]: mixed;
  };
  fieldsByTypeName: FieldsByTypeName;
};

export class BaseResolver<
  T extends BaseIdEntity = BaseIdEntity,
  RelationType extends string = string
> {
  protected relations: Array<RelationType> = [];
  protected derivedFieldsInfo: DerivedFieldsInfoType<T> = {};

  protected getSimplifiedInfo = (info: GraphQLResolveInfo): SimplifiedInfo => {
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
    const relations = this.relations.filter((relation) => {
      const chunks = relation.split('.');
      return chunks[chunks.length - 1] in simplifiedInfo.fields;
    });

    Object.entries(this.derivedFieldsInfo).forEach(([relationName, fields]) => {
      if (fields.some((field) => field in simplifiedInfo.fields)) {
        relations.push(relationName as RelationType);
      }
    });

    return [...new Set(relations.concat(includes))];
  }

  private checkFieldInInfo(
    fieldName: string,
    fieldsByTypeName: FieldsByTypeName
  ): boolean {
    if (fieldsByTypeName === {}) {
      return false;
    }

    return Object.values(fieldsByTypeName).some((fields) => {
      return Object.values(fields).some((resolveTree) => {
        if (resolveTree.name === fieldName) {
          return true;
        }

        return this.checkFieldInInfo(fieldName, resolveTree.fieldsByTypeName);
      });
    });
  }
}
