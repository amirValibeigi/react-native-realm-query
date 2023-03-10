import Database, {getDatabase} from '../Database';
import type CategoryModel from '../../models/CategoryModel';
import {CATEGORY_SCHEMA} from '../tables/CategoryTable';

export const insertOrUpdateCategoryQuery = (
  categories?: CategoryModel | CategoryModel[],
) =>
  new Promise<boolean>((resole, reject) => {
    if (!categories) {
      resole(true);
      return;
    }

    if (!(categories instanceof Array)) {
      categories = [categories];
    }

    try {
      getDatabase().then(realm => {
        realm.write(() => {
          (categories as CategoryModel[]).forEach(_category => {
            Database.create<CategoryModel>(
              CATEGORY_SCHEMA,
              _category,
              Realm.UpdateMode.Modified,
            );
          });
        });
        resole(true);
      });
    } catch (err) {
      reject(err);
    }
  });

export const getCategoriesQuery = () =>
  new Promise((resole, reject) => {
    try {
      let allCategory = Database.objects<CategoryModel>(CATEGORY_SCHEMA);

      resole(allCategory);
    } catch (err) {
      reject(err);
    }
  });
