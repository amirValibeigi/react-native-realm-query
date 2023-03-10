import Database, {getDatabase} from '../Database';
import CategoryModel from '../../models/CategoryModel';
import {CATEGORY_SCHEMA} from '../tables/CategoryTable';
import QueryBuilder from 'react-native-realm-query';

export type Filter = Partial<{
  betweenId: number[];
  findId: number;
  id: number | number[];
  raw: string;
  sort: boolean;
  title: string | string[];
  titleEnd: string;
  titleStart: string;
}>;

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

export const getCategoriesQuery = (filter?: Filter) =>
  new Promise<CategoryModel[]>((resole, reject) => {
    try {
      let allCategory = new QueryBuilder<CategoryModel>(
        Database,
        CATEGORY_SCHEMA,
      );

      allCategory
        .when(filter?.id, (pQ, id) => {
          //get param from when
          pQ.where('id', '=', id);

          //with group
          // pQ.groupStart()
          //   .where('id', '=', id)
          //   .groupEnd()
          //   .or()
          //   .groupStart()
          //   .where('id', '=', 5)
          //   .groupEnd();
        })
        .when(filter?.title, pQ => {
          pQ.orWhere('title', 'CONTAINS', filter?.title);
        })
        .when(filter?.raw, (pQ, raw) => {
          pQ.whereRaw(raw);
        })
        .when(filter?.findId, (pQ, id) => {
          //find
          console.log('find', JSON.stringify(pQ.find(id), null, 2));

          //findOr
          console.log(
            'findOr',
            JSON.stringify(pQ.findOr(id + 99, 'default value'), null, 2),
          );

          //findOrFail
          try {
            pQ.findOrFail(-1);
          } catch (error) {
            console.log('findOrFail', error);
          }
        })
        .when(filter?.betweenId, (pQ, betweenId) => {
          pQ.whereBetween('id', betweenId[0], betweenId[1]);
        })
        .when(filter?.titleStart, (pQ, titleStart) => {
          pQ.whereStart('title', titleStart);
        })
        .when(filter?.titleEnd, (pQ, titleEnd) => {
          pQ.whereEnd('title', titleEnd);
        })
        .when(filter?.sort, pQ => {
          pQ.sort('title', 'ASC').sort('id', 'DESC').limit(6, 3);
        });

      console.log('query:', allCategory.getQuery());

      if (filter?.findId) {
        resole([]);
      }

      resole(allCategory.get().map(pCategory => new CategoryModel(pCategory)));
    } catch (err) {
      reject(err);
    }
  });

export const clearCategoriesQuery = () =>
  new Promise<boolean>((resole, reject) => {
    try {
      getDatabase().then(realm => {
        realm.write(() => {
          Database.delete(Database.objects(CATEGORY_SCHEMA));
        });
        resole(true);
      });
    } catch (err) {
      reject(err);
    }
  });
