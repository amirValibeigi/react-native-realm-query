import React from 'react';
import {Text, View} from 'react-native';
import type CategoryModel from './models/CategoryModel';
import {styles} from './styles';

interface RenderItemProps {
  item: CategoryModel;
}

function RenderItem({item}: RenderItemProps) {
  return (
    <View style={styles.lyItem}>
      <Text>#{item.id}: </Text>
      <Text>{item.title}</Text>
    </View>
  );
}

export default RenderItem;
