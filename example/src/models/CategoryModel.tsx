export interface CategoryModelType {
  id?: number;
  title?: string;
}

export default class CategoryModel implements CategoryModelType {
  declare id?: number;
  declare title?: string;

  constructor(json: CategoryModelType) {
    this.id = json.id;
    this.title = json.title;
  }
}
