import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation'
import Cars from './Cars'
import MyCars from './MyCars'
import Employees from './Employees'

export default class App extends React.Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <ScreenNavigator />
      </View>
    );
  }
}

const ScreenNavigator = StackNavigator({
  Cars: { screen: Cars },
  MyCars: { screen: MyCars },
  Employees: {screen: Employees}
});