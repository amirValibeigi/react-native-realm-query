import type {ObjectSchema} from 'realm';

export const BRAND_SCHEMA = 'brands';

export const BrandSchema: ObjectSchema = {
  name: BRAND_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: 'int',
    category_id: 'int',
    title: 'string?',
  },
};
