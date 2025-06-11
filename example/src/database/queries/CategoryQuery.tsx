import QueryBuilder, {ValueType} from 'react-native-realm-query';
import BrandSimpleModel, {
  BrandSimpleModelType,
} from '../../models/BrandSimpleModel';
import Database, {getDatabase} from '../Database';

import CategoryModel from '../../models/CategoryModel';
import CategorySimpleModel from '../../models/CategorySimpleModel';
import {BRAND_SCHEMA} from '../tables/BrandTable';
import {CATEGORY_SCHEMA} from '../tables/CategoryTable';

export type Filter = Partial<{
  avgCount: boolean;
  betweenId: number[];
  findId: number;
  id: number | number[];
  brandIds: number[];
  raw: string;
  sort: boolean;
  title: string | string[];
  titleEnd: string;
  titleStart: string;
  typeDate: boolean;
  count: boolean;
  sumCount: boolean;
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
  new Promise<CategorySimpleModel[]>((resole, reject) => {
    try {
      const allCategory = new QueryBuilder<
        CategorySimpleModel,
        'categories',
        {brands: BrandSimpleModelType}
      >(CATEGORY_SCHEMA);

      allCategory
        .withHasMany(BRAND_SCHEMA, {mapTo: BrandSimpleModel})
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
        .when(filter?.avgCount, pQ => {
          console.log('avgCount', pQ.avg('brands.count'));
        })
        .when(filter?.sumCount, pQ => {
          console.log('sumCount', pQ.sum('brands.count'));
        })
        .when(filter?.count, pQ => {
          console.log('count categories', pQ.count());
          console.log('count brands', pQ.count('brands.id'));
        })
        .when(filter?.brandIds, (pQ, brandIds) => {
          pQ.where('brands.id', '=', brandIds);
        })
        .when(filter?.typeDate, pQ => {
          //type is string or int,float,double
          pQ.whereType('created_at', ValueType.string).orWhereType(
            'created_at',
            100000,
          );
        })
        .when(filter?.sort, pQ => {
          pQ.sort('title', 'ASC').sort('id', 'DESC').limit(6, 3);
        });

      console.log('query:', allCategory.getQuery());

      if (filter?.findId) {
        resole([]);
      }

      resole(
        allCategory.get().map(pCategory => new CategorySimpleModel(pCategory)),
      );
    } catch (err) {
      reject(err);
    }
  });

export const getCategoriesModelBase = (filter?: Filter) =>
  new Promise<CategoryModel[]>((resole, reject) => {
    try {
      const allCategory = CategoryModel.when<CategoryModel, number | number[]>(
        filter?.id,
        (pQ, id) => {
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
        },
      )
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
