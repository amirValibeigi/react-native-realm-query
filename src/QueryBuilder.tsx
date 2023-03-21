import type Realm from 'realm';
import { getRealm } from './Config';
import { schemaToId, schemaToTitle } from './Utils';

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
  | '==='
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
    | 'whereRaw';
  value?: WhereType | string;
};

export type WithType<T, P> = {
  type: 'belongTo' | 'belongToMany' | 'hasOne' | 'hasMany';
  ownerSchema: string;
  childSchema: string;
  ownerProperty?: keyof T | string;
  childProperty?: string;
  mapTo?: new (json?: any) => P;
};

export type WithOptionType<T, P> = {
  ownerProperty?: keyof T | string;
  childProperty?: keyof P | string;
  mapTo?: new (json?: any) => P;
};

export enum ValueType {
  bool = 'bool',
  int = 'int',
  float = 'float',
  double = 'double',
  string = 'string',
  decimal128 = 'decimal128',
  objectId = 'objectId',
  data = 'data',
  date = 'date',
  list = 'list',
  linkingObjects = 'linkingObjects',
  dictionary = 'dictionary',
}

const REGEX_DATE =
  /^([0-9]{1,4}(\/|-)){2}[0-9]{1,4}(((@|T| )(2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9])|)$/;

const CHECK_TYPE: WhereOperatorType[] = ['===', '<==', '>=='];

export default class QueryBuilder<T> {
  private schema: string;
  private realm: Realm;
  private queryList: QueryType[] = [];
  private withList: WithType<T, unknown>[] = [];
  private sortList: SortType<T>[] = [];
  private vOffset = -1;
  private vLimit = -1;

  constructor(schema: string, realm?: Realm) {
    this.realm = realm ?? getRealm();
    this.schema = schema;
  }

  where(
    property: keyof T,
    operator?: WhereOperatorType,
    value?: WhereValueType,
    isOr?: boolean
  ): QueryBuilder<T>;
  where(
    property: string,
    operator?: WhereOperatorType,
    value?: WhereValueType,
    isOr?: boolean
  ): QueryBuilder<T>;
  where(
    property: (queryBuilder: QueryBuilder<T>) => void,
    isOr?: boolean
  ): QueryBuilder<T>;
  where(property: WhereType, isOr?: boolean): QueryBuilder<T>;
  where(
    property:
      | WhereType
      | keyof T
      | string
      | ((queryBuilder: QueryBuilder<T>) => void),
    operator?: WhereOperatorType | boolean,
    value?: WhereValueType,
    isOr?: boolean
  ) {
    if (typeof property === 'function') {
      this.groupStart();

      property(this);

      return this.groupEnd();
    }

    if ((property as WhereType)?.property) {
      this.where(
        (property as WhereType).property,
        (property as WhereType).operator,
        (property as WhereType).value,
        isOr
      );

      return this;
    }

    if (operator && CHECK_TYPE.includes(operator as WhereOperatorType)) {
      this.groupStart();
    }

    this.queryList.push({
      type: isOr ? 'orWhere' : 'where',
      value: {
        property,
        value,
        operator,
      } as WhereType,
    });

    if (operator && CHECK_TYPE.includes(operator as WhereOperatorType)) {
      this.whereType(property as string, value as any).groupEnd();
    }

    return this;
  }

  orWhere(
    property: keyof T,
    operator?: WhereOperatorType,
    value?: WhereValueType
  ): QueryBuilder<T>;
  orWhere(
    property: string,
    operator?: WhereOperatorType,
    value?: WhereValueType
  ): QueryBuilder<T>;
  orWhere(property: WhereType): QueryBuilder<T>;
  orWhere(
    property: WhereType | keyof T | string,
    operator?: WhereOperatorType,
    value?: WhereValueType
  ) {
    if ((property as WhereType)?.property) {
      return this.where(property as WhereType, true);
    }

    return this.where(property as keyof T, operator, value, true);
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
    property: keyof T,
    a?: number,
    b?: number,
    isOr?: boolean
  ): QueryBuilder<T>;
  whereBetween(
    property: string,
    a?: number,
    b?: number,
    isOr?: boolean
  ): QueryBuilder<T>;
  whereBetween(
    property: Omit<WhereType, 'operator'>,
    isOr?: boolean
  ): QueryBuilder<T>;
  whereBetween(
    property: Omit<WhereType, 'operator'> | keyof T | string,
    a?: number | boolean,
    b?: number,
    isOr = false
  ) {
    if ((property as WhereType)?.property) {
      this.queryList.push({
        type: a ? 'orWhereBetween' : 'whereBetween',
        value: {
          property: (property as WhereType).property,
          value: (property as WhereType).value,
        } as WhereType,
      });

      return this;
    }

    this.queryList.push({
      type: isOr ? 'orWhereBetween' : 'whereBetween',
      value: {
        property,
        value: [a, b],
      } as WhereType,
    });

    return this;
  }

  orWhereBetween(property: keyof T, a?: number, b?: number): QueryBuilder<T>;
  orWhereBetween(property: string, a?: number, b?: number): QueryBuilder<T>;
  orWhereBetween(property: WhereType): QueryBuilder<T>;
  orWhereBetween(
    property: WhereType | keyof T | string,
    a?: number,
    b?: number
  ) {
    if ((property as WhereType)?.property) {
      return this.whereBetween(property as WhereType, true);
    }

    return this.whereBetween(property as keyof T, a, b, true);
  }

  whereStart(
    property: keyof T,
    value: string,
    insensitivity?: boolean,
    isOr?: boolean
  ): QueryBuilder<T>;
  whereStart(
    property: string,
    value: string,
    insensitivity?: boolean,
    isOr?: boolean
  ): QueryBuilder<T>;
  whereStart(
    property: keyof T | string,
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

  orWhereStart(
    property: keyof T,
    value: string,
    insensitivity?: boolean
  ): QueryBuilder<T>;
  orWhereStart(
    property: string,
    value: string,
    insensitivity?: boolean
  ): QueryBuilder<T>;
  orWhereStart(
    property: keyof T | string,
    value: string,
    insensitivity = false
  ) {
    return this.whereStart(property as keyof T, value, insensitivity, true);
  }

  whereType(
    property: keyof T,
    value:
      | keyof typeof ValueType
      | ValueType
      | (keyof typeof ValueType | ValueType)[]
      | (string | number)[],
    isOr?: boolean
  ): QueryBuilder<T>;
  whereType(
    property: string,
    value:
      | keyof typeof ValueType
      | ValueType
      | (keyof typeof ValueType | ValueType)[]
      | (string | number)[],
    isOr?: boolean
  ): QueryBuilder<T>;
  whereType(
    property: keyof T,
    value: string | number,
    isOr?: boolean
  ): QueryBuilder<T>;
  whereType(
    property: string,
    value: string | number,
    isOr?: boolean
  ): QueryBuilder<T>;
  whereType(
    property: keyof T | string,
    value:
      | keyof typeof ValueType
      | ValueType
      | string
      | number
      | (keyof typeof ValueType | ValueType)[]
      | (string | number)[],
    isOr = false
  ) {
    const vType = this.getTypeValue(value as any);
    console.log(property, vType);

    if (vType instanceof Array) {
      this.groupStart();
    }

    this.queryList.push({
      type: isOr ? 'orWhere' : 'where',
      value: {
        property: `${property as string}.@type`,
        value: vType,
        operator: '==',
      } as WhereType,
    });

    if (vType instanceof Array) {
      this.groupEnd();
    }

    return this;
  }

  orWhereType(
    property: keyof T,
    value:
      | keyof typeof ValueType
      | ValueType
      | (keyof typeof ValueType | ValueType)[]
      | (string | number)[]
  ): QueryBuilder<T>;
  orWhereType(
    property: string,
    value:
      | keyof typeof ValueType
      | ValueType
      | (keyof typeof ValueType | ValueType)[]
      | (string | number)[]
  ): QueryBuilder<T>;
  orWhereType(property: keyof T, value: string | number): QueryBuilder<T>;
  orWhereType(property: string, value: string | number): QueryBuilder<T>;
  orWhereType(
    property: keyof T | string,
    value:
      | keyof typeof ValueType
      | ValueType
      | string
      | number
      | (keyof typeof ValueType | ValueType)[]
      | (string | number)[]
  ) {
    return this.whereType(property as string, value as any, true);
  }

  whereEnd(
    property: keyof T,
    value: string,
    insensitivity?: boolean,
    isOr?: boolean
  ): QueryBuilder<T>;
  whereEnd(
    property: string,
    value: string,
    insensitivity?: boolean,
    isOr?: boolean
  ): QueryBuilder<T>;
  whereEnd(
    property: keyof T | string,
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

  orWhereEnd(
    property: keyof T,
    value: string,
    insensitivity?: boolean
  ): QueryBuilder<T>;
  orWhereEnd(
    property: string,
    value: string,
    insensitivity?: boolean
  ): QueryBuilder<T>;
  orWhereEnd(property: keyof T | string, value: string, insensitivity = false) {
    return this.whereEnd(property as string, value, insensitivity, true);
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

  sort(property: keyof T, sort: 'ASC' | 'DESC'): QueryBuilder<T>;
  sort(property: string, sort: 'ASC' | 'DESC'): QueryBuilder<T>;
  sort(property: keyof T | string, sort: 'ASC' | 'DESC' = 'ASC') {
    this.sortList.push({
      property,
      sort,
    });

    return this;
  }

  get() {
    const query = this.getQuery();
    let realmResults:
      | Realm.Results<T & Realm.Object<unknown, never>>
      | (T & Realm.Object<unknown, never>)[] = this.realm.objects<T>(
      this.schema
    );

    if (query.length > 0) {
      realmResults = realmResults.filtered(query);
    }

    if (this.sortList.length > 0) {
      realmResults = realmResults.sorted(
        this.sortList.map((pS) => [pS.property, pS.sort === 'DESC']) as any
      );
    }

    if (this.withList.length > 0) {
      this.withList.forEach((pWith) => {
        realmResults = this.getWith(
          pWith,
          realmResults as Realm.Results<T & Realm.Object<unknown, never>>
        );
      });
    }

    if (this.vLimit >= 0 || this.vOffset >= 0) {
      const vO = this.vOffset > 0 ? this.vOffset : 0;
      const vL = this.vLimit > 0 ? vO + this.vLimit : undefined;

      return realmResults.slice(vO, vL);
    }

    return realmResults;
  }

  find(id: number | string, property: keyof T | 'id' = 'id') {
    const vValue = this.where(property as keyof T, '=', id).get()[0];

    this.queryList.pop();

    return vValue;
  }

  findOr<P>(id: number | string, value: P, property: keyof T | 'id' = 'id') {
    return this.find(id, property) ?? value;
  }

  findOrFail(id: number | string, property: keyof T | 'id' = 'id') {
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
      let indexGroupStart = -1;
      let lastQuery: QueryType | undefined;

      do {
        const currentQuery = this.queryList[index];
        const currentType = currentQuery!.type.toLowerCase();
        let vQuery = '';

        switch (currentQuery!.type) {
          case 'where':
          case 'orWhere':
            if (currentQuery?.value) {
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
            }
            break;

          case 'whereRaw':
          case 'orWhereRaw':
            vQuery = currentQuery!.value as string;
            break;

          case 'whereBetween':
          case 'orWhereBetween':
            if (currentQuery?.value) {
              const vWhereBetween = currentQuery!.value as WhereType;
              const vValueBetween = vWhereBetween.value as Array<number>;

              vQuery = `${vWhereBetween?.property} BETWEEN { ${this.safeValue(
                vValueBetween[0]
              )},${this.safeValue(vValueBetween[1])} }`;
            }
            break;

          case 'groupEnd':
            vQuery = ')';
            break;

          case 'groupStart':
            vQuery = '(';
            if (indexGroupStart === -1) {
              indexGroupStart = vDoneQuery.length;
            }
            break;

          case 'and':
            vQuery = ' AND ';
            break;

          case 'or':
            vQuery = ' OR ';
            break;
        }

        if (
          lastQuery &&
          lastQuery.type !== 'groupStart' &&
          (index > indexGroupStart + 1 || indexGroupStart === -1)
        ) {
          switch (currentQuery!.type) {
            case 'where':
            case 'whereRaw':
            case 'whereBetween':
              vQuery = ' AND ' + vQuery;
              break;
            case 'orWhere':
            case 'orWhereRaw':
            case 'orWhereBetween':
              vQuery = ' OR ' + vQuery;
              break;
          }
        }

        if (indexGroupStart > 0 && currentType.indexOf('where') >= 0) {
          vDoneQuery.splice(
            indexGroupStart,
            0,
            currentQuery!.type.includes('or') ? ' OR ' : ' AND '
          );
          indexGroupStart = -1;
        }

        vDoneQuery.push(vQuery);
        lastQuery = currentQuery;
        index++;
      } while (this.queryList.length > index);
    }

    return vDoneQuery.join('');
  }

  getWith(
    pWith: WithType<T, unknown>,
    baseQuery: Realm.Results<T & Realm.Object<unknown, never>>
  ) {
    let vCP = pWith.childProperty ?? schemaToId(this.schema);
    let vOP = pWith.ownerProperty ?? 'id';
    const vMapTitle =
      pWith.type === 'hasOne' || pWith.type === 'belongTo'
        ? schemaToTitle(pWith.childSchema)
        : pWith.childSchema;

    if (pWith.type === 'belongTo' || pWith.type === 'belongToMany') {
      vCP = pWith.childProperty ?? 'id';
      vOP = pWith.ownerProperty ?? schemaToId(pWith.childSchema);
    }

    const ids = baseQuery.map((pBQ) => (pBQ as any)[vOP]);

    const childQuery = new QueryBuilder(pWith.childSchema)
      .where(vCP, '=', ids)
      .get();

    const ClassC = pWith.mapTo;

    return baseQuery.map((pBQ) => {
      const tmpObj = {};
      let vChildObj: any = childQuery.filter(
        (pCQ) => (pCQ as any)[vCP] === (pBQ as any)[vOP]
      );

      if (ClassC) {
        vChildObj = vChildObj.map((pVCO: any) => new ClassC(pVCO));
      }

      (tmpObj as any)[vMapTitle] =
        pWith.type === 'hasOne' || pWith.type === 'belongTo'
          ? vChildObj[0]
          : vChildObj;

      return Object.assign(pBQ, tmpObj);
    });
  }

  count(property?: keyof T): number;
  count(property?: string): number;
  count(property?: keyof T | string) {
    if (property) {
      const { count } = this.flatProperty(property, this.get());
      return count;
    }

    return this.get().length;
  }
  avg(property: keyof T): number;
  avg(property: string): number;
  avg(property: keyof T | string) {
    const { num, count } = this.flatProperty(property, this.get());

    return num.map((pO) => Number(pO)).reduce((pV, cV) => pV + cV, 0) / count;
  }

  sum(property: keyof T): number;
  sum(property: string): number;
  sum(property: keyof T | string) {
    const { num } = this.flatProperty(property, this.get());
    return num.map((pO) => Number(pO)).reduce((pV, cV) => pV + cV, 0);
  }

  private flatProperty(
    property: keyof T | string | string[],
    obj: any
  ): { num: any[]; count: number } {
    if (typeof property === 'string') {
      return this.flatProperty(property.split('.'), obj);
    }
    const vKeys = property as string[];

    const key = vKeys.shift();

    if (obj instanceof Array) {
      if (key === undefined) {
        const num = obj.flat(5);
        return { num, count: num.length };
      }

      return this.flatProperty(
        vKeys,
        obj.map((pO) => {
          if (pO instanceof Array) {
            return pO.map((pOO) => this.objArrFlat(pOO, key));
          }

          return this.objArrFlat(pO, key);
        })
      );
    }

    return this.flatProperty(vKeys, obj[key as any]);
  }

  private objArrFlat(obj: any, key: string) {
    if (Object.hasOwnProperty.call(obj, key)) {
      return obj[key as any];
    }

    return;
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

    if (CHECK_TYPE.includes(operator)) {
      return operator.substring(0, 2);
    }

    return operator;
  }

  private getTypeValue(
    value: ValueType | string | (ValueType | string)[] | number
  ) {
    if (value instanceof Array) {
      return value.map(this.mapToTypeValue).flat(3);
    }

    return this.mapToTypeValue(value);
  }

  private mapToTypeValue(value: ValueType | string | number) {
    if (value in ValueType) {
      return value;
    }

    if (typeof value !== 'string' && isFinite(value as any)) {
      return [ValueType.int, ValueType.float, ValueType.double];
    }

    if ((value as string).match(REGEX_DATE) !== null) {
      return ValueType.date;
    }

    return ValueType.string;
  }

  withBelongTo<P>(childSchema: string, option?: WithOptionType<T, P>) {
    this.withList.push({
      ...option,
      type: 'belongTo',
      ownerSchema: this.schema,
      childSchema,
      childProperty: option?.childProperty ?? 'id',
      ownerProperty: option?.ownerProperty,
    } as WithType<T, P>);

    return this;
  }

  withBelongToMany<P>(childSchema: string, option?: WithOptionType<T, P>) {
    this.withList.push({
      ...option,
      type: 'belongToMany',
      ownerSchema: this.schema,
      childSchema,
      childProperty: option?.childProperty,
      ownerProperty: option?.ownerProperty ?? 'id',
    } as WithType<T, P>);

    return this;
  }

  withHasMany<P>(childSchema: string, option?: WithOptionType<T, P>) {
    this.withList.push({
      ...option,
      type: 'hasMany',
      ownerSchema: this.schema,
      childSchema,
      childProperty: option?.childProperty,
      ownerProperty: option?.ownerProperty ?? 'id',
    } as WithType<T, P>);

    return this;
  }

  withHasOne<P>(childSchema: string, option?: WithOptionType<T, P>) {
    this.withList.push({
      ...option,
      type: 'hasOne',
      ownerSchema: this.schema,
      childSchema,
      childProperty: option?.childProperty,
      ownerProperty: option?.ownerProperty ?? 'id',
    } as WithType<T, P>);

    return this;
  }
}
