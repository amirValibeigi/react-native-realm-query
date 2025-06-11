import QueryBuilder, { ValueType } from './QueryBuilder';
import type { WhereOperatorType, WhereType, WhereValueType } from './types';

import { schemaToId } from './Utils';

export default class ModelRelationship<T> {
  public static getTable: () => string;

  private getTableName() {
    return (this.constructor as any).getTable();
  }

  belongTo<P>(
    schema: string,
    childProperty: keyof P | string = 'id',
    ownerProperty?: keyof T | string
  ) {
    return new QueryBuilder<P>(schema)
      .where(
        childProperty as string,
        '=',
        (this as any)[ownerProperty ?? schemaToId(schema)] ?? -1
      )
      .first();
  }

  belongToMany<P>(
    schema: string,
    ownerProperty: keyof T | string = 'id',
    childProperty?: keyof P | string
  ) {
    return new QueryBuilder<P>(schema)
      .where(
        childProperty as string,
        '=',
        (this as any)[ownerProperty ?? schemaToId(schema)] ?? -1
      )
      .get();
  }

  hasMany<P>(
    schema: string,
    ownerProperty: keyof T | string = 'id',
    childProperty?: keyof P | string
  ) {
    return new QueryBuilder<P>(schema)
      .where(
        (childProperty ?? schemaToId(this.getTableName())) as string,
        '=',
        (this as any)[ownerProperty] ?? -1
      )
      .get();
  }

  hasOne<P>(
    schema: string,
    ownerProperty: keyof T | string = 'id',
    childProperty?: keyof P | string
  ) {
    return new QueryBuilder<P>(schema)
      .where(
        (childProperty ?? schemaToId(this.getTableName())) as string,
        '=',
        (this as any)[ownerProperty] ?? -1
      )
      .first();
  }

  static first<T>() {
    return new QueryBuilder<T>(this.getTable()).first();
  }
  static firstOr<T, P>(value: P) {
    return new QueryBuilder<T>(this.getTable()).firstOr(value);
  }
  static firstOrFail<T>() {
    return new QueryBuilder<T>(this.getTable()).first();
  }
  static find<T>(id: number | string, property?: 'id') {
    return new QueryBuilder<T>(this.getTable()).find(id, property);
  }
  static findOr<T, P>(id: number | string, value: P, property?: 'id') {
    return new QueryBuilder<T>(this.getTable()).findOr(id, value, property);
  }
  static findOrFail<T>(id: number | string, property?: 'id') {
    return new QueryBuilder<T>(this.getTable()).findOrFail(id, property);
  }

  static where<T>(
    property: keyof T,
    operator?: WhereOperatorType,
    value?: WhereValueType,
    isOr?: boolean
  ): QueryBuilder<T>;
  static where<T>(
    property: string,
    operator?: WhereOperatorType,
    value?: WhereValueType,
    isOr?: boolean
  ): QueryBuilder<T>;
  static where<T>(
    property: (queryBuilder: QueryBuilder<T>) => void,
    isOr?: boolean
  ): QueryBuilder<T>;
  static where<T>(property: WhereType, isOr?: boolean): QueryBuilder<T>;
  static where<T>(
    property:
      | WhereType
      | keyof T
      | string
      | ((queryBuilder: QueryBuilder<T>) => void),
    operator?: WhereOperatorType | boolean,
    value?: WhereValueType
  ) {
    if ((property as WhereType)?.property) {
      return new QueryBuilder<T>(this.getTable()).where(property as WhereType);
    }

    return new QueryBuilder<T>(this.getTable()).where(
      property as string,
      operator as any,
      value
    );
  }

  static whereType<T>(
    property: keyof T,
    value:
      | keyof typeof ValueType
      | ValueType
      | (keyof typeof ValueType | ValueType)[]
      | (string | number)[],
    isOr?: boolean
  ): QueryBuilder<T>;
  static whereType<T>(
    property: string,
    value:
      | keyof typeof ValueType
      | ValueType
      | (keyof typeof ValueType | ValueType)[]
      | (string | number)[],
    isOr?: boolean
  ): QueryBuilder<T>;
  static whereType<T>(
    property: keyof T,
    value: string | number,
    isOr?: boolean
  ): QueryBuilder<T>;
  static whereType<T>(
    property: string,
    value: string | number,
    isOr?: boolean
  ): QueryBuilder<T>;
  static whereType<T>(
    property: keyof T | string,
    value:
      | keyof typeof ValueType
      | ValueType
      | string
      | number
      | (keyof typeof ValueType | ValueType)[]
      | (string | number)[]
  ) {
    return new QueryBuilder<T>(this.getTable()).whereType(
      property as string,
      value as any
    );
  }

  static whereBetween<T>(
    property: keyof T,
    a?: number,
    b?: number,
    isOr?: boolean
  ): QueryBuilder<T>;
  static whereBetween<T>(
    property: string,
    a?: number,
    b?: number,
    isOr?: boolean
  ): QueryBuilder<T>;
  static whereBetween<T>(
    property: Omit<WhereType, 'operator'>,
    isOr?: boolean
  ): QueryBuilder<T>;
  static whereBetween<T>(
    property: Omit<WhereType, 'operator'> | keyof T | string,
    a?: number | boolean,
    b?: number
  ) {
    if ((property as WhereType)?.property) {
      return new QueryBuilder<T>(this.getTable()).whereBetween(
        property as WhereType
      );
    }

    return new QueryBuilder<T>(this.getTable()).whereBetween(
      property as keyof T,
      a as any,
      b
    );
  }

  static whereEnd<T>(
    property: keyof T,
    value: string,
    insensitivity?: boolean,
    isOr?: boolean
  ): QueryBuilder<T>;
  static whereEnd<T>(
    property: string,
    value: string,
    insensitivity?: boolean,
    isOr?: boolean
  ): QueryBuilder<T>;
  static whereEnd<T>(
    property: keyof T | string,
    value: string,
    insensitivity = false
  ) {
    return new QueryBuilder<T>(this.getTable()).whereEnd(
      property as string,
      value,
      insensitivity
    );
  }

  static whereStart<T>(
    property: keyof T,
    value: string,
    insensitivity?: boolean,
    isOr?: boolean
  ): QueryBuilder<T>;
  static whereStart<T>(
    property: string,
    value: string,
    insensitivity?: boolean,
    isOr?: boolean
  ): QueryBuilder<T>;
  static whereStart<T>(
    property: keyof T,
    value: string,
    insensitivity = false
  ) {
    return new QueryBuilder<T>(this.getTable()).whereStart(
      property,
      value,
      insensitivity
    );
  }
  static when<T, P>(
    value: P | undefined | null,
    callback: (queryBuilder: QueryBuilder<T>, value: P) => void
  ) {
    return new QueryBuilder<T>(this.getTable()).when(value, callback);
  }
  static get<T>() {
    return new QueryBuilder<T>(this.getTable()).get();
  }

  static count<T>(property?: keyof T): number;
  static count(property?: string): number;
  static count<T>(property?: keyof T | string) {
    return new QueryBuilder<T>(this.getTable()).count(property as string);
  }

  static avg<T>(property: keyof T): number;
  static avg(property: string): number;
  static avg<T>(property: keyof T | string) {
    return new QueryBuilder<T>(this.getTable()).avg(property as string);
  }

  static sum<T>(property: keyof T): number;
  static sum(property: string): number;
  static sum<T>(property: keyof T | string) {
    return new QueryBuilder<T>(this.getTable()).sum(property as string);
  }
}
