import React from 'react';
import {Text, View} from 'react-native';
import type CategoryModel from './models/CategoryModel';
import type CategorySimpleModel from './models/CategorySimpleModel';
import {styles} from './styles';

interface RenderItemProps {
  item: CategoryModel | CategorySimpleModel;
}

function RenderItem({item}: RenderItemProps) {
  const brands =
    (item.brands instanceof Array ? item.brands : item.brands?.()) ?? [];

  return (
    <View>
      <View style={styles.lyItem}>
        <Text>#{item.id}: </Text>
        <Text>{item.title}</Text>
      </View>

      <View style={styles.itemBrands}>
        {brands.map(pBrand => (
          <Text key={pBrand.id}>⚫ {pBrand.title}</Text>
        ))}
      </View>
    </View>
  );
}

export default RenderItem;
