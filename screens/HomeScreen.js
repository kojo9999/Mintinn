import React from "react";
import { Component } from "react";
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
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
        </View>

        <View style={styles.diaryAct}>
        <TouchableOpacity style={styles.touchable} onPress={() => this.props.navigation.navigate("CalendarScreen")}>
          <ImageBackground
            source={require("../images/clouds.png")}
            style={styles.image}
          >
            <View style={styles.titleContainer}>
            <Text style={styles.title}>Diary Statistics</Text>
            <Text style={styles.diaryDescription}>
              The overview of all your progress 
            </Text>
            </View>
            
          </ImageBackground>
          </TouchableOpacity>
        </View>
        <Text style={styles.subActText}>More activites ...</Text>
        <View style={styles.subAct}>
          <ScrollView horizontal={true}>
            <View style={styles.subActWindow}>
            <TouchableOpacity style={styles.touchable} onPress={() => this.props.navigation.navigate("SleepScreen")}>
            <ImageBackground
                source={require("../images/sleep.jpg")}
                style={styles.image}
              ><Text style={styles.subActTitle}>Sleep</Text></ImageBackground>
            </TouchableOpacity>
            </View>
            <View style={styles.subActWindow}>
            <TouchableOpacity style={styles.touchable} onPress={() => this.props.navigation.navigate("WaterScreen")}>
            <ImageBackground
                source={require("../images/water.jpg")}
                style={styles.image}
              ><Text style={styles.subActTitle}>Water</Text>
              </ImageBackground>
            </TouchableOpacity>
            </View>
            <View style={styles.subActWindow}>
            <TouchableOpacity style={styles.touchable} onPress={() => this.props.navigation.navigate("NutritionScreen")}>
              <ImageBackground
                source={require("../images/food.jpg")}
                style={styles.image}
              ><Text style={styles.subActTitle}>Food</Text>
              </ImageBackground>
              </TouchableOpacity>
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
    marginRight: 150,
  },
  diaryAct: {
    alignSelf: "stretch",
    textAlign: "center",
    height: 450,
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
    alignItems: "center"
  },
  headerItem: {
    flex: 1,
    textAlign: "center",
  },
  image: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden"
  },
  touchable:{
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  subActTitle: {
    fontSize: 20,
    padding: 15,
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
  },
  titleContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 20,
    height: "100%",
    width: "100%",
    borderRadius: 10
  }
});
