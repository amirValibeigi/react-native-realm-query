import CategorySimpleModel from './CategorySimpleModel';

export interface BrandSimpleModelType {
  id?: number;
  category_id?: number;
  count?: number;
  title?: string;
  category?: CategorySimpleModel;
}

export default class BrandSimpleModel implements BrandSimpleModelType {
  declare id?: number;
  declare category_id?: number;
  declare count?: number;
  declare title?: string;
  declare category?: CategorySimpleModel;

  constructor(json: BrandSimpleModelType) {
    this.id = json.id;
    this.category_id = json.category_id;
    this.count = json.count;
    this.title = json.title;

    if (json.category) {
      this.category = new CategorySimpleModel(json.category);
    }
  }
}
