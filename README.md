# react-native-realm-query

realm query

## Installation

```sh
npm install react-native-realm-query
```

## Usage query builder

```js
import QueryBuilder, { setRealm } from 'react-native-realm-query';

// ...

setRealm(DATABASE); //for base model

console.log(new QueryBuilder(SCHEMA_NAME).get());
```

> [{...},{...},{...}]

## Usage base model

```js
import { ModelRelationship } from 'react-native-realm-query';
import { BRAND_SCHEMA } from '@tables/BrandTable';
import { CATEGORY_SCHEMA } from '@tables/CategoryTable';

interface BrandModelType {
  //...
}

export default class BrandModel extends ModelRelationship<BrandModelType> {
  constructor(json: BrandModelType) {
    super();
    this.id = json.id;
    this.title = json.title;
    //...
  }

  categories() {
    return this.hasMany(CATEGORY_SCHEMA);
  }
}

BrandModel.getTable = () => BRAND_SCHEMA;
```

```js
import BrandModel from '@models/BrandModel';

const brands = BrandModel.get().map((pB) => new BrandModel(pB));

console.log(brands);
console.log(brands[0].categories());
```

> [{id:1,title:'samsung'},{...},{...}]

> [{id:1,brand_id:1,title:'phone'},{...},{...}]

---

## Query Builder Methods

- and
- avg((keyof T | string)?)
- count((keyof T | string)?)
- find(id, property?)
- findOr(id, value, property?)
- findOrFail(id)
- first
- firstOr(value)
- firstOrFail
- get
- getQuery
- groupEnd
- groupStart
- limit(count, offset)
- offset(offset)
- or
- orWhere(WhereType | keyof T | string, WhereOperatorType?, WhereValueType?)
- orWhereBetween(property, a, b)
- orWhereEnd(property, text)
- orWhereRaw(query)
- orWhereStart(property, text)
- orWhereType(property: keyof T | string, value: ValueType | string | (ValueType | string)[] | number)
- sort(property, ASC | DESC)
- sum((keyof T | string)?)
- when(value?, (queryBuilder, value) => void)
- where(WhereType | keyof T | string, WhereOperatorType?, WhereValueType?)
- whereBetween(property, a, b)
- whereEnd(property, text)
- whereRaw(query)
- whereStart(property, text)
- whereType(property: keyof T | string, value: ValueType | string | (ValueType | string)[] | number)
- withBelongTo(schemaName,WithOption)
- withBelongToMany(schemaName,WithOption)
- withHasMany(schemaName,WithOption)
- withHasOne(schemaName,WithOption)

#### WithOption

- ownerProperty? keyof T | string
- childProperty? keyof P | string
- mapTo?: new (json:any) => P

#### WhereType

- property: string
- operator?: WhereOperatorType
- value: WhereValueType

#### WhereOperatorType

'!' | '!=' | '<' | '<=' | '<==' | '<>' | '=' | '==' | '>' | '>=' | '>==' | 'BEGINSWITH' | 'BEGINSWITH[c]' | 'CONTAINS' | 'CONTAINS[c]' | 'ENDSWITH' | 'ENDSWITH[c]' | 'LIKE' | 'LIKE[c]'

#### WhereValueType

string | number | (string | number)[] | null | undefined

---

## Base Model methods

- belongTo(schema, childProperty? = 'id', ownerProperty?)
- belongToMany(schema, ownerProperty? = 'id', childProperty?)
- hasMany(schema, ownerProperty? = 'id', childProperty?)
- hasOne(schema, ownerProperty? = 'id', childProperty?)
- static avg
- static count
- static find
- static findOr
- static findOrFail
- static first
- static firstOr
- static firstOrFail
- static get
- static getTableName
- static sum
- static when
- static where
- static whereBetween
- static whereEnd
- static whereStart
- static whereType

---

## next version

- whereHas

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
