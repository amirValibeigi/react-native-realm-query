import type Realm from 'realm';
import { getRealm } from './Config';

export type WhereValueType =
  | string
  | number
  | (string | number)[]
  | null
  | undefined;
export type WhereOperatorType =
  | '!'
  | '!='
  | '<'
  | '<='
  | '<=='
  | '<>'
  | '='
  | '=='
  | '>'
  | '>='
  | '>=='
  | 'BEGINSWITH'
  | 'BEGINSWITH[c]'
  | 'CONTAINS'
  | 'CONTAINS[c]'
  | 'ENDSWITH'
  | 'ENDSWITH[c]'
  | 'LIKE'
  | 'LIKE[c]';

export type WhereType = {
  property: string;
  operator?: WhereOperatorType;
  value: WhereValueType;
};

export type SortType<T> = {
  property: keyof T | string;
  sort: 'ASC' | 'DESC';
};

export type QueryType = {
  type:
    | 'and'
    | 'distinct'
    | 'groupEnd'
    | 'groupStart'
    | 'limit'
    | 'or'
    | 'orWhere'
    | 'orWhereBetween'
    | 'orWhereRaw'
    | 'orWhereType'
    | 'sort'
    | 'where'
    | 'whereBetween'
    | 'whereRaw'
    | 'whereType';
  value?: WhereType | string;
};

export default class QueryBuilder<T> {
  private schema: string;
  private realm: Realm;
  private queryList: QueryType[] = [];
  private sortList: SortType<T>[] = [];
  private vOffset: number = -1;
  private vLimit: number = -1;

  constructor(schema: string, realm?: Realm) {
    this.realm = realm ?? getRealm();
    this.schema = schema;
  }

  where(
    property: WhereType | keyof T,
    operator?: WhereOperatorType,
    value?: WhereValueType,
    isOr = false
  ) {
    if ((property as WhereType).property) {
      this.queryList.push({
        type: isOr ? 'orWhere' : 'where',
        value: property as WhereType,
      });

      return this;
    }

    this.queryList.push({
      type: isOr ? 'orWhere' : 'where',
      value: {
        property,
        value,
        operator,
      } as WhereType,
    });

    return this;
  }

  orWhere(
    property: WhereType | keyof T,
    operator?: WhereOperatorType,
    value?: WhereValueType
  ) {
    return this.where(property, operator, value, true);
  }

  whereRaw(query: string, isOr = false) {
    this.queryList.push({
      type: isOr ? 'orWhereRaw' : 'whereRaw',
      value: query,
    });

    return this;
  }

  orWhereRaw(query: string) {
    return this.whereRaw(query, true);
  }

  whereBetween(
    property: WhereType | keyof T,
    a?: number,
    b?: number,
    isOr = false
  ) {
    this.queryList.push({
      type: isOr ? 'orWhereBetween' : 'whereBetween',
      value: {
        property,
        value: [a, b],
      } as WhereType,
    });

    return this;
  }

  orWhereBetween(property: WhereType | keyof T, a?: number, b?: number) {
    return this.whereBetween(property, a, b, true);
  }

  whereStart(
    property: keyof T,
    value: string,
    insensitivity = false,
    isOr = false
  ) {
    this.queryList.push({
      type: isOr ? 'orWhere' : 'where',
      value: {
        property,
        operator: insensitivity ? 'BEGINSWITH[c]' : 'BEGINSWITH',
        value,
      } as WhereType,
    });

    return this;
  }

  orWhereStart(property: keyof T, value: string, insensitivity = false) {
    return this.whereStart(property, value, insensitivity, true);
  }

  whereEnd(
    property: keyof T,
    value: string,
    insensitivity = false,
    isOr = false
  ) {
    this.queryList.push({
      type: isOr ? 'orWhere' : 'where',
      value: {
        property,
        operator: insensitivity ? 'ENDSWITH[c]' : 'ENDSWITH',
        value,
      } as WhereType,
    });

    return this;
  }

  orWhereEnd(property: keyof T, value: string, insensitivity = false) {
    return this.whereEnd(property, value, insensitivity, true);
  }

  when<P>(
    value: P | undefined | null,
    callback: (queryBuilder: QueryBuilder<T>, value: P) => void
  ) {
    if (value !== undefined && value !== null) {
      callback(this, value!);
    }

    return this;
  }

  groupEnd() {
    this.queryList.push({
      type: 'groupEnd',
    });

    return this;
  }

  groupStart() {
    this.queryList.push({
      type: 'groupStart',
    });

    return this;
  }

  and() {
    this.queryList.push({
      type: 'and',
    });

    return this;
  }

  or() {
    this.queryList.push({
      type: 'or',
    });

    return this;
  }

  sort(property: keyof T, sort: 'ASC' | 'DESC' = 'ASC') {
    this.sortList.push({
      property,
      sort,
    });

    return this;
  }

  get() {
    const query = this.getQuery();
    let realmResults = this.realm.objects<T>(this.schema);

    if (query.length > 0) {
      realmResults = realmResults.filtered(query);
    }

    if (this.sortList.length > 0) {
      realmResults = realmResults.sorted(
        this.sortList.map((pS) => [pS.property, pS.sort === 'DESC']) as any
      );
    }

    if (this.vLimit >= 0 || this.vOffset >= 0) {
      const vO = this.vOffset > 0 ? this.vOffset : 0;
      const vL = this.vLimit > 0 ? vO + this.vLimit : undefined;

      return realmResults.slice(vO, vL);
    }

    return realmResults;
  }

  find(id: number, property: keyof T | 'id' = 'id') {
    const vValue = this.where(property as keyof T, '=', id).get()[0];

    this.queryList.pop();

    return vValue;
  }

  findOr<P>(id: number, value: P, property: keyof T | 'id' = 'id') {
    return this.find(id, property) ?? value;
  }

  findOrFail(id: number, property: keyof T | 'id' = 'id') {
    const vValue = this.find(id, property);

    if (vValue === null || vValue === undefined) {
      throw new Error('object not found');
    }

    return vValue;
  }

  first() {
    return this.get()[0];
  }

  firstOr<P>(value: P) {
    return this.first() ?? value;
  }

  firstOrFail() {
    const vValue = this.first();

    if (vValue === null || vValue === undefined) {
      throw new Error('object not found');
    }

    return vValue;
  }

  offset(pOffset?: number) {
    this.vOffset = pOffset ?? -1;

    return this;
  }

  limit(count?: number, pOffset?: number) {
    if (pOffset) {
      this.offset(pOffset);
    }
    this.vLimit = count ?? -1;

    return this;
  }

  getQuery() {
    const vDoneQuery: string[] = [];

    if (this.queryList.length > 0) {
      let index = 0;
      let lastQuery: QueryType | undefined;

      do {
        const currentQuery = this.queryList[index];
        let vQuery = '';

        switch (currentQuery!.type) {
          case 'where':
          case 'orWhere':
            const vWhere = currentQuery!.value as WhereType;
            if (vWhere.value instanceof Array) {
              vQuery = vWhere.value
                .map(
                  (pValue) =>
                    `${vWhere?.property} ${this.safeOperator(
                      vWhere.operator
                    )} ${this.safeValue(pValue)}`
                )
                .join(' OR ');
            } else {
              vQuery = `${vWhere?.property} ${this.safeOperator(
                vWhere.operator
              )} ${this.safeValue(vWhere.value)}`;
            }
            break;

          case 'whereRaw':
          case 'orWhereRaw':
            vQuery = currentQuery!.value as string;
            break;

          case 'whereBetween':
          case 'orWhereBetween':
            const vWhereBetween = currentQuery!.value as WhereType;
            const vValueBetween = vWhereBetween.value as Array<number>;

            vQuery = `${vWhereBetween?.property} BETWEEN { ${this.safeValue(
              vValueBetween[0]
            )},${this.safeValue(vValueBetween[1])} }`;
            break;

          case 'groupEnd':
            vQuery = ')';
            break;

          case 'groupStart':
            vQuery = '(';
            break;

          case 'and':
            vQuery = ' AND ';
            break;

          case 'or':
            vQuery = ' OR ';
            break;
        }

        if (lastQuery && lastQuery.type != 'groupStart') {
          switch (currentQuery!.type) {
            case 'where':
            case 'whereRaw':
              vQuery = ' AND ' + vQuery;
              break;
            case 'orWhere':
            case 'orWhereRaw':
              vQuery = ' OR ' + vQuery;
              break;
          }
        }

        vDoneQuery.push(vQuery);
        lastQuery = currentQuery;
        index++;
      } while (this.queryList.length > index);
    }

    return vDoneQuery.join('');
  }

  private safeValue(value?: Omit<WhereValueType, '(string|number)[]'> | null) {
    if (value === null || value === undefined) {
      return 'null';
    }

    if (typeof value === 'string') {
      return `'${value}'`;
    }

    return value;
  }

  private safeOperator(operator?: WhereOperatorType) {
    if (!operator) {
      return '=';
    }

    if (operator === 'LIKE[c]') {
      return 'CONTAINS[c]';
    }

    if (operator === 'LIKE') {
      return 'CONTAINS';
    }

    return operator;
  }
}
