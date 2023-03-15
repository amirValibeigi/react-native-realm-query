import {ModelRelationship} from 'react-native-realm-query';
import {BRAND_SCHEMA} from '../database/tables/BrandTable';
import {CATEGORY_SCHEMA} from '../database/tables/CategoryTable';
import BrandModel from './BrandModel';

export interface CategoryModelType {
  id?: number;
  title?: string;
  created_at?: string | number | Date;
}

export default class CategoryModel
  extends ModelRelationship<CategoryModelType>
  implements CategoryModelType
{
  declare id?: number;
  declare title?: string;
  declare created_at?: string | number | Date;

  constructor(json: CategoryModelType) {
    super();

    this.id = json.id;
    this.title = json.title;
    this.created_at = json.created_at;
  }

  brands() {
    return this.hasMany(BRAND_SCHEMA).map(pB => new BrandModel(pB as object));
  }
}

CategoryModel.getTable = () => CATEGORY_SCHEMA;
