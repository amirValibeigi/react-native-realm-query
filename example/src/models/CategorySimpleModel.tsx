import BrandSimpleModel from './BrandSimpleModel';

export interface CategorySimpleModelType {
  id?: number;
  title?: string;
  brands?: BrandSimpleModel[];
}

export default class CategorySimpleModel implements CategorySimpleModelType {
  declare id?: number;
  declare title?: string;
  declare brands?: BrandSimpleModel[];

  constructor(json: CategorySimpleModelType) {
    this.id = json.id;
    this.title = json.title;

    if (json.brands) {
      this.brands = json.brands.map(pB => new BrandSimpleModel(pB));
    }
  }
}
