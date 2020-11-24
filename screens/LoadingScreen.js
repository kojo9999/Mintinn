import React from "react";
import { Button, Text, View } from "react-native";
import { Component } from "react";
import firebase from "firebase/app";
import "firebase/auth";

class LoadingScreen extends Component {
  componentDidMount() {
    this.checkIfLoggedIn();
}

  checkIfLoggedIn = () => {
    this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.navigation.navigate("HomeScreen", { user });
      } else {
        this.props.navigation.navigate("WelcomeScreen");
      }
    });
  };

  componentWillUnmount = () => {
    this.unsubscribe();
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View>
          <Text>LoadingScreen</Text>
        </View>
      </View>
    );
  }
}
export default LoadingScreen;
