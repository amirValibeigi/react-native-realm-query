import React from 'react';
import {Text, View} from 'react-native';
import {multiply} from 'react-native-realm-query';

function App() {
  return (
    <View>
      <Text>{multiply(4, 2)}</Text>
    </View>
  );
}

export default App;
