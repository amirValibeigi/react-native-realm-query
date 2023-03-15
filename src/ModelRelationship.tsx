import QueryBuilder, {
  ValueType,
  WhereOperatorType,
  WhereType,
  WhereValueType,
} from './QueryBuilder';
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
        childProperty as keyof P,
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
        childProperty as keyof P,
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
        (childProperty ?? schemaToId(this.getTableName())) as keyof P,
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
        (childProperty ?? schemaToId(this.getTableName())) as keyof P,
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
    property: WhereType | keyof T,
    operator?: WhereOperatorType | undefined,
    value?: WhereValueType
  ) {
    return new QueryBuilder<T>(this.getTable()).where(
      property,
      operator,
      value
    );
  }
  static whereType<T>(
    property: keyof T | string,
    value: ValueType | string | (ValueType | string)[] | number
  ) {
    return new QueryBuilder<T>(this.getTable()).whereType(property, value);
  }
  static whereBetween<T>(
    property: WhereType | keyof T,
    a?: number,
    b?: number
  ) {
    return new QueryBuilder<T>(this.getTable()).whereBetween(property, a, b);
  }
  static whereEnd<T>(property: keyof T, value: string, insensitivity = false) {
    return new QueryBuilder<T>(this.getTable()).whereEnd(
      property,
      value,
      insensitivity
    );
  }
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
}
