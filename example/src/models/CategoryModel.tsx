import QueryBuilder, {ModelRelationship} from 'react-native-realm-query';
import {BRAND_SCHEMA} from '../database/tables/BrandTable';
import {CATEGORY_SCHEMA} from '../database/tables/CategoryTable';

export interface CategoryModelType {
  id?: number;
  title?: string;
}

export default class CategoryModel
  extends ModelRelationship<CategoryModelType>
  implements CategoryModelType
{
  declare id?: number;
  declare title?: string;

  constructor(json: CategoryModelType) {
    super();

    this.id = json.id;
    this.title = json.title;
  }

  brands() {
    return this.hasMany(BRAND_SCHEMA);
  }
}

CategoryModel.getTable = () => CATEGORY_SCHEMA;
