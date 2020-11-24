import React from "react";
import { Component } from "react";
import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";
import firebase from "firebase/app";
import "firebase/auth";

class HomeScreen extends Component {
  signOut = async () => {
    try {
      await firebase.auth().signOut();
      this.props.navigation.navigate("WelcomeScreen");
    } catch (errors) {
      alert("unable to sign out right now");
    }
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <SafeAreaView />
        <View
          style={{
            height: 70,
            borderBottomWidth: 0.5,
            borderBottomColor: "#E9E9E9",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 24 }}>Book worm</Text>
        </View>
        <View style={{ flex: 1 }} />
        <View
          style={{
            height: 70,
            borderTopWidth: 0.5,
            borderTopColor: "#E9E9E9",
            flexDirection: "row",
          }}
        >
          <Button
            title="Log Out"
            onPress={() => this.props.navigation.navigate("WelcomeScreen")}
          ></Button>
        </View>
        <SafeAreaView />
      </View>
    );
  }
}
export default HomeScreen;
