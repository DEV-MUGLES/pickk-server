import {
  FieldsByTypeName,
  parseResolveInfo,
  ResolveTree,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';
import { GraphQLResolveInfo } from 'graphql';

export type DerivedFieldsInfoType = {
  [relationName: string]: string[];
};
export type ReplaceRelationsInfo = {
  [relationName: string]: string;
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

export class BaseResolver<RelationType extends string = string> {
  protected relations: Array<RelationType> = [];
  protected derivedFieldsInfo: DerivedFieldsInfoType = {};
  protected replaceRelationsInfo: ReplaceRelationsInfo = {};

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

    const relations = this.relations.filter((relation) =>
      this.checkRelationInFields(relation, simplifiedInfo.fieldsByTypeName, '')
    );

    Object.entries(this.derivedFieldsInfo).forEach(([relationName, fields]) => {
      if (fields.some((field) => field in simplifiedInfo.fields)) {
        relations.push(relationName as RelationType);
      }
    });

    return [...new Set(relations.concat(includes))].map((v) => {
      let result = v;
      Object.entries(this.replaceRelationsInfo).forEach(([origin, target]) => {
        result = result.replace(origin, target) as RelationType;
      });

      return result;
    });
  }

  private checkRelationInFields(
    relationName: string,
    fieldsByTypeName: FieldsByTypeName,
    parent: string
  ): boolean {
    if (fieldsByTypeName === {}) {
      return false;
    }

    return Object.values(fieldsByTypeName).some((fields) => {
      return Object.values(fields).some((resolveTree) => {
        const current = `${parent === '' ? parent : parent + '.'}${
          resolveTree.name
        }`;

        if (current === relationName) {
          return true;
        }

        return this.checkRelationInFields(
          relationName,
          resolveTree.fieldsByTypeName,
          current
        );
      });
    });
  }
}
