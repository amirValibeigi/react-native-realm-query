import Realm from 'realm';
import {BrandSchema} from './tables/BrandTable';
import {CategorySchema} from './tables/CategoryTable';

////////////////Options
export const DatabaseOptions: Realm.Configuration = {
  path: 'database.realm',
  schema: [CategorySchema, BrandSchema],
  schemaVersion: 1,
};
////////////////Options

export default new Realm(DatabaseOptions);
export const getDatabase = () => Realm.open(DatabaseOptions);
