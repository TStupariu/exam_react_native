import React from 'react';
import { StyleSheet, Text, View, ScrollView, RefreshControl } from 'react-native';
import { List, ListItem, Button, FormLabel, FormInput } from 'react-native-elements'
import { NetInfo } from 'react-native';
import * as Progress from 'react-native-progress';

export default class Cars extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cars: [],
      online: true,
      buyCarId: 0,
      buyCarQuantity: 0,
      showProgress: false,
      refreshing: false
    }
    screen: Cars
  } 

  async componentDidMount() {
    NetInfo.isConnected.fetch().done(async (isConnected) => {
      if ( isConnected )
      {
        this.setState({showProgress: true})
        fetch('http://192.168.43.129:4000/cars').then(async (response) => {
          const cars = await response.json()
          this.setState({cars: cars, online: true, showProgress: false})
          console.log("Fetch cars Request /cars")
        })
      } else {
        this.setState({online: false})
      }
    })

  }

  _onRefresh() {
    this.setState({refreshing: true})
    this.getCars()
    this.setState({refreshing: false})
  }

  getCars() {
    this.setState({showProgress: true})
    fetch('http://192.168.43.129:4000/cars').then(async (response) => {
      const cars = await response.json()
      this.setState({cars: cars, showProgress: false})
      console.log("Fetch cars Request /cars")
    })
  }

  handleInputChangeId(data) {
    this.setState({buyCarId: data})
  }

  handleInputChangeQuantity(data) {
    this.setState({buyCarQuantity: data})
  }

  getCarById(id) {
    for (let x of this.state.cars) {
      if (x.id == id) {
        return x
      }
    }
  }

  buyCar() {
    fetch('http://192.168.43.129:4000/buyCar', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: this.state.buyCarId,
        quantity: this.state.buyCarQuantity,
      }),
    }).then((response) => {
      console.log("Request /buyCar")
    });
    const car = this.getCarById(this.state.buyCarId)
    const { navigate } = this.props.navigation;
    navigate('MyCars', {car: car})
  }

  navigateToPurchased() {
    const { navigate } = this.props.navigation;
    navigate('MyCars')
  }

  navigateEmployees() {
    const { navigate } = this.props.navigation;
    navigate('Employees')
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollView style={{flex:1}} refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />} >
          {
            !this.state.online ? <Text>Device Offline!</Text> : null
          }
          {
            this.state.online ? <Button title='Employees' onPress={() => {this.navigateEmployees()}}/> : null
          }
          {
            this.state.showProgress ? <Progress.Circle size={30} indeterminate={true} /> : null
          }
          <Button title="Refresh" onPress={() => {this.getCars()}}/>
          <Button title="Purchased" onPress={() => {this.navigateToPurchased()}}/>
          <FormLabel>Car ID</FormLabel>
          <FormInput onChangeText={(data) => {this.handleInputChangeId(data)}}/>
          <FormLabel>Car Quantity</FormLabel>
          <FormInput onChangeText={(data) => {this.handleInputChangeQuantity(data)}}/>
          <Button title="Buy Car" onPress={() => {this.buyCar()}} />
          <List>
          {
            this.state.cars.map((el, id) => {
              return (
                <ListItem key={id} title={el.id + ' - ' + el.name + '|' + el.quantity + '|' + el.type } />
                )
            })
          }
          </List>
        </ScrollView>
      </View>
    );
  }
}