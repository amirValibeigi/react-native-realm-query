import Database, {getDatabase} from '../Database';
import type BrandModel from '../../models/BrandModel';
import {BRAND_SCHEMA} from '../tables/BrandTable';

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
