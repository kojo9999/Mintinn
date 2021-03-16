import React from "react";
import { Component } from "react";
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar
} from "react-native";
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
            onPress={() => this.props.navigation.openDrawer()}
          />
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Ionicons
            style={styles.headerItem}
            name="ios-contact"
            size={50}
            md="md-contact"
          />
        </View>

        <View style={styles.diaryAct}>
          <ImageBackground
            source={require("../images/clouds.png")}
            style={styles.image}
          >
            <Text style={styles.title}>Diary Statistics</Text>
            <Text style={styles.diaryDescription}>
              You Statistics can be used to see an overview of your daily progress
            </Text>
            <TouchableOpacity style={styles.downArrow} onPress={() => this.props.navigation.navigate("CalendarScreen")}></TouchableOpacity>
          </ImageBackground>
        </View>
        <Text style={styles.subActText}>More activites ...</Text>
        <View style={styles.subAct}>
          <ScrollView horizontal={true}>
            <View style={styles.subActWindow}>
              <ImageBackground
                source={require("../images/sleep.jpg")}
                style={styles.image}
              ><Text style={styles.title}>Sleep</Text><TouchableOpacity style={styles.subDownArrow} onPress={() => this.props.navigation.navigate("SleepScreen")}></TouchableOpacity></ImageBackground>
            </View>
            <View style={styles.subActWindow}>
              <ImageBackground
                source={require("../images/water.jpg")}
                style={styles.image}
              ><Text style={styles.title}>Water</Text><TouchableOpacity style={styles.subDownArrow} onPress={() => this.props.navigation.navigate("WaterScreen")}></TouchableOpacity></ImageBackground>
            </View>
            <View style={styles.subActWindow}>
              <ImageBackground
                source={require("../images/food.jpg")}
                style={styles.image}
              ><Text style={styles.title}>Food</Text><TouchableOpacity style={styles.subDownArrow} onPress={() => this.props.navigation.navigate("NutritionScreen")}></TouchableOpacity></ImageBackground>
            </View>
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
    marginRight: 50,
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
    marginTop: 20,
  },
  subAct: {
    height: 200,
    alignSelf: "stretch",
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  subActText: {
    textAlign: "left",
    marginLeft: 20,
    alignSelf: "stretch",
    fontSize: 18,
    marginTop: 10,
  },
  subActWindow: {
    backgroundColor: "orange",
    borderRadius: 20,
    height: 160,
    width: 160,
    marginBottom: 20,
    marginLeft: 20,
  },
  headerView: {
 
    paddingTop: StatusBar.currentHeight + 10,
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headerItem: {
    flex: 1,
    textAlign: "center",
  },
  image: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
    padding: 15,
    paddingLeft: 20,
    paddingRight: 20
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white"
  },
  downArrow: {
    backgroundColor: "white",
    width: 50,
    height: 50,
    marginTop: 20, 
    borderRadius: 40

  },
  subDownArrow: {
    backgroundColor: "white",
    width: 25,
    height: 25,
    marginTop: 10, 
    borderRadius: 40

  },
  diaryDescription: {
    color: "white"
  }
});

{
  /* onPress={() => this.props.navigation.navigate("WelcomeScreen")} */
}
