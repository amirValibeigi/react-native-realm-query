import React from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {setRealm} from 'react-native-realm-query';
import Database from './database/Database';
import {useCategory} from './hooks';
import RenderItem from './RenderItem';
import {styles} from './styles';

setRealm(Database);

function App() {
  const {categories, ...props} = useCategory();

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        data={categories}
        ListHeaderComponent={<Header {...props} />}
        renderItem={RenderItem}
      />
    </View>
  );
}

const Header = ({
  getSimpleCategories,
  onPressAddCategory,
  onPressResetCategory,
  onPressResetFilter,
  onPressFilterId,
  onPressFilterIdTwo,
  onPressFilterLikeTitle,
  onPressFilterIdOrTitle,
  onPressFilterFindId,
  onPressFilterRaw,
  onPressFilterBetweenId,
  onPressFilterTitleStart,
  onPressFilterTitleEnd,
  onPressFilterTypeDate,
  onPressFilterSortTitleId,

  getModelBaseCategories,
  onPressModelBaseFilterId,
  onPressModelBaseFilterIdTwo,
  onPressModelBaseFilterLikeTitle,
  onPressModelBaseFilterIdOrTitle,
  onPressModelBaseFilterFindId,
  onPressModelBaseFilterRaw,
  onPressModelBaseFilterBetweenId,
  onPressModelBaseFilterTitleStart,
  onPressModelBaseFilterTitleEnd,
  onPressModelBaseFilterSortTitleId,
}: any) => {
  return (
    <View style={styles.header}>
      <Btn onPress={onPressResetCategory}>reset & init category</Btn>
      <Btn onPress={onPressAddCategory}>add category</Btn>
      <Btn onPress={onPressResetFilter}>reset</Btn>
      <Btn onPress={getSimpleCategories}>get category with query</Btn>
      <Btn onPress={getModelBaseCategories}>get category with model base</Btn>
      <GroupView title="filter queryBuilder category">
        <Btn onPress={onPressFilterId}>id</Btn>
        <Btn onPress={onPressFilterIdTwo}>two id</Btn>
        <Btn onPress={onPressFilterLikeTitle}>like title</Btn>
        <Btn onPress={onPressFilterIdOrTitle}>id or title</Btn>
        <Btn onPress={onPressFilterFindId}>find id</Btn>
        <Btn onPress={onPressFilterRaw}>raw id and title</Btn>
        <Btn onPress={onPressFilterBetweenId}>between id 2,5</Btn>
        <Btn onPress={onPressFilterTitleStart}>title start `win`</Btn>
        <Btn onPress={onPressFilterTitleEnd}>title end `oid`</Btn>
        <Btn onPress={onPressFilterSortTitleId}>
          sort title ASC,id DESC limit 6,3
        </Btn>
        <Btn onPress={onPressFilterTypeDate}>type date</Btn>
      </GroupView>
      <GroupView title="filter model base category">
        <Btn onPress={onPressModelBaseFilterId}>id</Btn>
        <Btn onPress={onPressModelBaseFilterIdTwo}>two id</Btn>
        <Btn onPress={onPressModelBaseFilterLikeTitle}>like title</Btn>
        <Btn onPress={onPressModelBaseFilterIdOrTitle}>id or title</Btn>
        <Btn onPress={onPressModelBaseFilterFindId}>find id</Btn>
        <Btn onPress={onPressModelBaseFilterRaw}>raw id and title</Btn>
        <Btn onPress={onPressModelBaseFilterBetweenId}>between id 2,5</Btn>
        <Btn onPress={onPressModelBaseFilterTitleStart}>title start `win`</Btn>
        <Btn onPress={onPressModelBaseFilterTitleEnd}>title end `oid`</Btn>
        <Btn onPress={onPressModelBaseFilterSortTitleId}>
          sort title ASC,id DESC limit 6,3
        </Btn>
      </GroupView>
    </View>
  );
};

const Btn = ({children, onPress}: any) => {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <Text style={styles.btnTitle}>{children}</Text>
    </TouchableOpacity>
  );
};

const GroupView = ({title, children}: any) => {
  return (
    <View style={styles.groupView}>
      <Text style={styles.groupViewTitle}>{title}</Text>
      {children}
    </View>
  );
};

export default React.memo(App);
