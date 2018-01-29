import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, ScrollView } from 'react-native';
import { List, ListItem, Button, FormLabel, FormInput } from 'react-native-elements'
import { NetInfo } from 'react-native';

import * as Progress from 'react-native-progress';

export default class Employees extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cars: [],
      carName: '',
      carQuantity: '',
      carType: '',
      carStatus: 'available',
      deleteId: '0',
      showProgress: false
    }
    screen: Employees
  } 

  async componentDidMount() {
    fetch('http://192.168.43.129:4000/all').then(async (response) => {
      const cars = await response.json()
      this.setState({cars: cars})
    })
  }

  async addCar() {
    this.setState({showProgress: true})
    fetch('http://192.168.43.129:4000/addCar', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: this.state.carName,
        quantity: this.state.carQuantity,
        type: this.state.carType,
        status: this.state.carStatus
      }),
    }).then(async (response) => {
      console.log(await response.json())
      this.setState({showProgress: false})
      console.log("Delete car /addCar")
    });
  }

  async deleteCar() {
    this.setState({showProgress: true})
    fetch('http://192.168.43.129:4000/removeCar', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: this.state.deleteId
      }),
    }).then(async (response) => {
      console.log(await response.json())
      this.setState({showProgress: false})
      console.log("Delete car /removeCar")
    });
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollView style={{flex:1}}>
          <Text>Employees</Text>
          {
            this.state.showProgress ? <Progress.Circle size={30} indeterminate={true} /> : null
          }
          <Button title="Add car" onPress={() => {this.addCar()}} />
          <FormLabel>Car Name</FormLabel>
          <FormInput onChangeText={(data) => {this.setState({carName: data})}}/>
          <FormLabel>Car Quantity</FormLabel>
          <FormInput onChangeText={(data) => {this.setState({carQuantity: data})}}/>
          <FormLabel>Car Type</FormLabel>
          <FormInput onChangeText={(data) => {this.setState({carType: data})}}/>
          <FormLabel>Car Status</FormLabel>
          <FormInput onChangeText={(data) => {this.setState({carStatus: data})}}/>
          <Button title="Delete car" onPress={() => {this.deleteCar()}} />
          <FormLabel>Car Id</FormLabel>
          <FormInput onChangeText={(data) => {this.setState({deleteId: data})}}/>
          <List>
            {
              this.state.cars.map((el, id) => {
                return (
                  <ListItem key={id} title={el.id + ' - ' + el.name + '|' + el.quantity + '|' + el.type + ' | ' + el.status} />
                  )
              })
            }
          </List>
        </ScrollView>
      </View>
    );
  }
}