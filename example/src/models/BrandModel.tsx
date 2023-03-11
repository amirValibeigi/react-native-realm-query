import {ModelRelationship} from 'react-native-realm-query';
import {BRAND_SCHEMA} from '../database/tables/BrandTable';
import {CATEGORY_SCHEMA} from '../database/tables/CategoryTable';

export interface BrandModelType {
  id?: number;
  category_id?: number;
  title?: string;
}

export default class BrandModel
  extends ModelRelationship<BrandModelType>
  implements BrandModelType
{
  declare id?: number;
  declare category_id?: number;
  declare title?: string;

  constructor(json: BrandModelType) {
    super();

    this.id = json.id;
    this.category_id = json.category_id;
    this.title = json.title;
  }

  category() {
    return this.belongTo(CATEGORY_SCHEMA);
  }
}

BrandModel.getTable = () => BRAND_SCHEMA;
