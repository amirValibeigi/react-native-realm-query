import React from 'react';
import {
  clearBrandsQuery,
  insertOrUpdateBrandQuery,
} from './database/queries/BrandQuery';
import {
  clearCategoriesQuery,
  Filter,
  getCategoriesQuery,
  insertOrUpdateCategoryQuery,
} from './database/queries/CategoryQuery';
import BrandModel from './models/BrandModel';
import CategoryModel from './models/CategoryModel';

let categoryId = 1;

export function useCategory() {
  const [categories, setCategories] = React.useState<CategoryModel[]>();

  const getCategories = React.useCallback((filter?: Filter) => {
    getCategoriesQuery(filter).then(pCategories => {
      if (pCategories) {
        setCategories(pCategories);

        if (pCategories.length > 0) {
          categoryId =
            (pCategories
              .map(pC => pC.id ?? 0)
              .sort((a: number, b: number) => b - a)[0] ?? 0) + 1;
        }
      }
    });
  }, []);

  const onPressResetCategory = React.useCallback(() => {
    clearCategoriesQuery().then(() => {
      insertOrUpdateCategoryQuery(initCategories);

      clearBrandsQuery().then(() => {
        insertOrUpdateBrandQuery(initBrands).finally(() => {
          getCategories();
        });
      });
    });
  }, [getCategories]);

  const onPressAddCategory = React.useCallback(() => {
    insertOrUpdateCategoryQuery(
      new CategoryModel({
        id: categoryId,
        title: `category`,
      }),
    ).then(() => {
      categoryId++;

      getCategories();
    });
  }, [categoryId, getCategories]);

  const onPressFilters = React.useMemo(
    () => ({
      onPressResetFilter: getCategories,
      onPressFilterId: getCategories.bind(null, {id: 2}),
      onPressFilterIdTwo: getCategories.bind(null, {id: [1, 3]}),
      onPressFilterLikeTitle: getCategories.bind(null, {title: 'android'}),
      onPressFilterIdOrTitle: getCategories.bind(null, {
        id: [1],
        title: 'android',
      }),
      onPressFilterFindId: getCategories.bind(null, {
        findId: 4,
      }),
      onPressFilterRaw: getCategories.bind(null, {
        raw: "title contains 'i' and (id = 1 or id = 3)",
      }),
      onPressFilterBetweenId: getCategories.bind(null, {
        betweenId: [2, 5],
      }),
      onPressFilterTitleStart: getCategories.bind(null, {
        titleStart: 'win',
      }),
      onPressFilterTitleEnd: getCategories.bind(null, {
        titleEnd: 'oid',
      }),
      onPressFilterSortTitleId: getCategories.bind(null, {
        sort: true,
      }),
    }),
    [getCategories],
  );

  React.useEffect(getCategories, []);

  return {
    ...onPressFilters,
    onPressResetCategory,
    categories,
    onPressAddCategory,
  };
}

const initCategories = [
  new CategoryModel({
    id: 1,
    title: 'windows',
  }),
  new CategoryModel({
    id: 2,
    title: 'android',
  }),
  new CategoryModel({
    id: 3,
    title: 'ios',
  }),
  new CategoryModel({
    id: 4,
    title: 'mac',
  }),
];

const initBrands = [
  new BrandModel({
    id: 1,
    category_id: 1,
    title: 'microsoft',
  }),
  new BrandModel({
    id: 2,
    category_id: 2,
    title: 'samsung',
  }),
  new BrandModel({
    id: 3,
    category_id: 2,
    title: 'sony',
  }),
  new BrandModel({
    id: 4,
    category_id: 3,
    title: 'apple',
  }),
  new BrandModel({
    id: 5,
    category_id: 4,
    title: 'apple',
  }),
];
