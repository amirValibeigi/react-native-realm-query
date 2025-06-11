type addPrefixDotToObject<T, P extends string | undefined> = {
  [K in keyof T as K extends string ? `${P}.${K}` : never]: T[K];
};
type DotPrefix<T extends string> = T extends '' ? '' : `.${T}`;

type DotNestedKeys<T> = (
  T extends object
    ? {
        [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<
          DotNestedKeys<T[K]>
        >}`;
      }[Exclude<keyof T, symbol>]
    : ''
) extends infer D
  ? Extract<D, string>
  : never;

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

export type SortType<SchemaModel> = {
  property: keyof SchemaModel | string;
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

export type WithType<SchemaModel, P> = {
  type: 'belongTo' | 'belongToMany' | 'hasOne' | 'hasMany';
  ownerSchema: string;
  childSchema: string;
  ownerProperty?: keyof SchemaModel | string;
  childProperty?: string;
  nameMapTo?: string;
  mapTo?: new (json?: any) => P;
};

export type WithOptionType<SchemaModel, P> = {
  ownerProperty?: keyof SchemaModel | string;
  childProperty?: keyof P | string;
  mapTo?: new (json?: any) => P;
};
