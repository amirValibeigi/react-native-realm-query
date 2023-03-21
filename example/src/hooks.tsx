import React from 'react';
import {
  clearBrandsQuery,
  insertOrUpdateBrandQuery,
} from './database/queries/BrandQuery';
import {
  clearCategoriesQuery,
  Filter,
  getCategoriesModelBase,
  getCategoriesQuery,
  insertOrUpdateCategoryQuery,
} from './database/queries/CategoryQuery';
import BrandModel from './models/BrandModel';
import CategoryModel from './models/CategoryModel';
import type CategorySimpleModel from './models/CategorySimpleModel';

export function useCategory() {
  const [categories, setCategories] =
    React.useState<(CategoryModel | CategorySimpleModel)[]>();
  const [categoryId, setCategoryId] = React.useState<number>(1);

  const getSimpleCategories = React.useCallback((filter?: Filter) => {
    getCategoriesQuery(filter).then(pCategories => {
      if (pCategories) {
        setCategories(pCategories);

        if (pCategories.length > 0) {
          setCategoryId(
            (pCategories
              .map(pC => pC.id ?? 0)
              .sort((a: number, b: number) => b - a)[0] ?? 0) + 1,
          );
        }
      }
    });
  }, []);

  const getModelBaseCategories = React.useCallback((filter?: Filter) => {
    getCategoriesModelBase(filter).then(pCategories => {
      if (pCategories) {
        setCategories(pCategories);

        if (pCategories.length > 0) {
          setCategoryId(
            (pCategories
              .map(pC => pC.id ?? 0)
              .sort((a: number, b: number) => b - a)[0] ?? 0) + 1,
          );
        }
      }
    });
  }, []);

  const onPressResetCategory = React.useCallback(() => {
    clearCategoriesQuery().then(() => {
      insertOrUpdateCategoryQuery(initCategories);

      clearBrandsQuery().then(() => {
        insertOrUpdateBrandQuery(initBrands).finally(() => {
          getSimpleCategories();
        });
      });
    });
  }, [getSimpleCategories]);

  const onPressAddCategory = React.useCallback(() => {
    insertOrUpdateCategoryQuery(
      new CategoryModel({
        id: categoryId,
        title: 'category',
      }),
    ).then(() => {
      setCategoryId(pCI => pCI + 1);

      getSimpleCategories();
    });
  }, [categoryId, getSimpleCategories]);

  const onPressFilters = React.useMemo(
    () => ({
      onPressResetFilter: () => setCategories([]),
      onPressFilterId: getSimpleCategories.bind(null, {id: 2}),
      onPressFilterIdTwo: getSimpleCategories.bind(null, {id: [1, 3]}),
      onPressFilterLikeTitle: getSimpleCategories.bind(null, {
        title: 'android',
      }),
      onPressFilterIdOrTitle: getSimpleCategories.bind(null, {
        id: [1],
        title: 'android',
      }),
      onPressFilterFindId: getSimpleCategories.bind(null, {
        findId: 4,
      }),
      onPressFilterRaw: getSimpleCategories.bind(null, {
        raw: "title contains 'i' and (id = 1 or id = 3)",
      }),
      onPressFilterBetweenId: getSimpleCategories.bind(null, {
        betweenId: [2, 5],
      }),
      onPressFilterTitleStart: getSimpleCategories.bind(null, {
        titleStart: 'win',
      }),
      onPressFilterTitleEnd: getSimpleCategories.bind(null, {
        titleEnd: 'oid',
      }),
      onPressFilterTypeDate: getSimpleCategories.bind(null, {
        typeDate: true,
      }),
      onPressFilterSortTitleId: getSimpleCategories.bind(null, {
        sort: true,
      }),

      onPressAvgCount: getSimpleCategories.bind(null, {
        avgCount: true,
      }),
      onPressSumCount: getSimpleCategories.bind(null, {
        sumCount: true,
      }),
      onPressCount: getSimpleCategories.bind(null, {
        count: true,
      }),

      onPressModelBaseFilterId: getModelBaseCategories.bind(null, {id: 2}),
      onPressModelBaseFilterIdTwo: getModelBaseCategories.bind(null, {
        id: [1, 3],
      }),
      onPressModelBaseFilterLikeTitle: getModelBaseCategories.bind(null, {
        title: 'android',
      }),
      onPressModelBaseFilterIdOrTitle: getModelBaseCategories.bind(null, {
        id: [1],
        title: 'android',
      }),
      onPressModelBaseFilterFindId: getModelBaseCategories.bind(null, {
        findId: 4,
      }),
      onPressModelBaseFilterRaw: getModelBaseCategories.bind(null, {
        raw: "title contains 'i' and (id = 1 or id = 3)",
      }),
      onPressModelBaseFilterBetweenId: getModelBaseCategories.bind(null, {
        betweenId: [2, 5],
      }),
      onPressModelBaseFilterTitleStart: getModelBaseCategories.bind(null, {
        titleStart: 'win',
      }),
      onPressModelBaseFilterTitleEnd: getModelBaseCategories.bind(null, {
        titleEnd: 'oid',
      }),
      onPressModelBaseFilterSortTitleId: getModelBaseCategories.bind(null, {
        sort: true,
      }),
    }),
    [getSimpleCategories, getModelBaseCategories],
  );

  return {
    ...onPressFilters,
    onPressResetCategory,
    categories,
    onPressAddCategory,
    getSimpleCategories,
    getModelBaseCategories,
  };
}

const initCategories = [
  new CategoryModel({
    id: 1,
    title: 'windows',
    created_at: Date.now(),
  }),
  new CategoryModel({
    id: 2,
    title: 'android',
    created_at: new Date(),
  }),
  new CategoryModel({
    id: 3,
    title: 'ios',
    created_at: '2012/12/12 12:12:12',
  }),
  new CategoryModel({
    id: 4,
    title: 'mac',
    created_at: '12/12/12',
  }),
];

const initBrands = [
  new BrandModel({
    id: 1,
    category_id: 1,
    count: 3,
    title: 'microsoft',
  }),
  new BrandModel({
    id: 2,
    category_id: 2,
    count: 2,
    title: 'samsung',
  }),
  new BrandModel({
    id: 3,
    category_id: 2,
    count: 6,
    title: 'sony',
  }),
  new BrandModel({
    id: 4,
    category_id: 3,
    count: 1,
    title: 'apple',
  }),
  new BrandModel({
    id: 5,
    category_id: 4,
    count: 0,
    title: 'apple',
  }),
];
