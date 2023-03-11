import Database, {getDatabase} from '../Database';
import BrandModel from '../../models/BrandModel';
import {BRAND_SCHEMA} from '../tables/BrandTable';
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

export const insertOrUpdateBrandQuery = (brands?: BrandModel | BrandModel[]) =>
  new Promise<boolean>((resole, reject) => {
    if (!brands) {
      resole(true);
      return;
    }

    if (!(brands instanceof Array)) {
      brands = [brands];
    }

    try {
      getDatabase().then(realm => {
        realm.write(() => {
          (brands as BrandModel[]).forEach(_brand => {
            Database.create<BrandModel>(
              BRAND_SCHEMA,
              _brand,
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

export const getBrandsQuery = (filter?: Filter) =>
  new Promise<BrandModel[]>((resole, reject) => {
    try {
      let allBrand = new QueryBuilder<BrandModel>(BRAND_SCHEMA);

      allBrand
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

      console.log('query:', allBrand.getQuery());

      if (filter?.findId) {
        resole([]);
      }

      resole(allBrand.get().map(pBrand => new BrandModel(pBrand)));
    } catch (err) {
      reject(err);
    }
  });

export const clearBrandsQuery = () =>
  new Promise<boolean>((resole, reject) => {
    try {
      getDatabase().then(realm => {
        realm.write(() => {
          Database.delete(Database.objects(BRAND_SCHEMA));
        });
        resole(true);
      });
    } catch (err) {
      reject(err);
    }
  });
