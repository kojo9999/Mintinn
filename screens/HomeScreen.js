import React from "react";
import { Component } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

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
      <SafeAreaView style={styles.container}>
        <View style={styles.headerView}>
          <Ionicons
            style={styles.headerItem}
            name="ios-menu"
            size={50}
            md="md-menu"
          />
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Ionicons
            style={styles.headerItem}
            name="ios-contact"
            size={50}
            md="md-contact"
          />
        </View>

        <View style={styles.diaryAct}></View>
        <Text style={styles.subActText}>More activites</Text>
        <View style={styles.subAct}>
          <ScrollView horizontal={true}>
            <View style={styles.subActWindow}></View>
            <View style={styles.subActWindow}></View>
            <View style={styles.subActWindow}></View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    marginLeft: 50,
    marginRight: 50
  },
  diaryAct: {
    backgroundColor: "#FDD7E4",
    alignSelf: "stretch",
    textAlign: "center",
    backgroundColor: "black",
    height: 350,
    borderRadius: 20,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20
  },
  subAct: {
    height: 200,
    alignSelf: "stretch",
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  subActText: {
    fontSize: 18,
    marginTop: 5,
  },
  subActWindow: {
    backgroundColor: "orange",
    borderRadius: 20,
    height: 160,
    width: 160,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 20,
  },
  headerView: {
  
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headerItem: {
    flex: 1,
    textAlign: "center",
  
  },
});

{
  /* onPress={() => this.props.navigation.navigate("WelcomeScreen")} */
}
