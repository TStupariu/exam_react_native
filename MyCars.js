import React from 'react';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import { List, ListItem, Button, FormLabel, FormInput } from 'react-native-elements'
import { NetInfo } from 'react-native';

import * as Progress from 'react-native-progress';

export default class MyCars extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cars: [],
      showProgress: false
    }
    screen: MyCars
  } 

  async componentDidMount() {
    let mycars = JSON.parse(await AsyncStorage.getItem('mycars'))
    if (this.props.navigation.state.params) {
      const car = this.props.navigation.state.params.car
      if (!mycars) mycars = []
      mycars.push(car)      
      AsyncStorage.setItem('mycars', JSON.stringify(mycars))
    }    
    this.setState({cars: mycars})
  }

  clearStorage() {
    AsyncStorage.setItem('mycars', JSON.stringify([]))
  }

  returnCar() {
    this.setState({showProgress: true})
    fetch('http://192.168.43.129:4000/returnCar', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: this.state.returnCarId
      }),
    }).then((response) => {
      this.setState({showProgress: false})
      console.log("Return car /returnCar")
    });
  }

  render() {
    return (
      <View style={{flex: 1}}>
      {
        this.state.showProgress ? <Progress.Circle size={30} indeterminate={true} /> : null
      }
      <Button title='Clear Purchased' onPress={() => {this.clearStorage()}} />
      <Button title="Return car" onPress={() => {this.returnCar()}}/>
      <FormLabel>Car ID</FormLabel>
      <FormInput onChangeText={(data) => {this.setState({returnCarId: data})}}/>
      <List>
        {
          this.state.cars.map((el, id) => {
            return (
              <ListItem key={id} title={el.id + '|' + el.name} />
              )
          })
        }
        </List>
      </View>
    );
  }
}