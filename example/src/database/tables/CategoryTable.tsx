import type {ObjectSchema} from 'realm';

export const CATEGORY_SCHEMA = 'categories';

export const CategorySchema: ObjectSchema = {
  name: CATEGORY_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: 'int',
    title: 'string?',
    created_at: 'mixed?',
  },
};
