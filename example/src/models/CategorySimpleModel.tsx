import BrandSimpleModel from './BrandSimpleModel';

export interface CategorySimpleModelType {
  id?: number;
  title?: string;
  brands?: BrandSimpleModel[];
  created_at?: string | number | Date;
}

export default class CategorySimpleModel implements CategorySimpleModelType {
  declare id?: number;
  declare title?: string;
  declare brands?: BrandSimpleModel[];
  declare created_at?: string | number | Date;

  constructor(json: CategorySimpleModelType) {
    this.id = json.id;
    this.title = json.title;
    this.created_at = json.created_at;

    if (json.brands) {
      this.brands = json.brands.map(pB => new BrandSimpleModel(pB));
    }
  }
}
