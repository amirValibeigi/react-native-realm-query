import Realm from 'realm';
import {CategorySchema} from './tables/CategoryTable';

////////////////Options
export const DatabaseOptions: Realm.Configuration = {
  path: 'database.realm',
  schema: [CategorySchema],
  schemaVersion: 1,
};
////////////////Options

export default new Realm(DatabaseOptions);
export const getDatabase = () => Realm.open(DatabaseOptions);
