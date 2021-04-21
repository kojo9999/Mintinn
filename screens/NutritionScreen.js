import React from "react";
import { Snackbar } from "react-native-paper";
import { Text, View, StyleSheet, Image, StatusBar } from "react-native";
import {
  TouchableOpacity,
  TouchableNativeFeedback,
} from "react-native-gesture-handler";
import "firebase/auth";
import "firebase/firestore";
import firebase from "firebase/app";
import { db } from "../config/config";
import Slider from "@react-native-community/slider";
import Collapsible from "react-native-collapsible";
import { Ionicons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
const foodCollection = db().collection("profile");

export default class FoodScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      foodData: [],
      createdat: "",
      userId: "",
      sliderValue: 1,
      error: "",
      snackbarShow: false,
      morning: "None",
      afternoon: "None",
      evening: "None",
      timeOfDay: this.TimeOfDay(),
    };
  }

  handleSnackbar = () => {
    this.setState({ snackbarShow: true });
    setTimeout(() => {
      this.setState({ snackbarShow: false });
    }, 3000);
  };

  onDismissSnackBar = () => {
    this.setState({ snackbarShow: false });
  };

  toggleExpanded = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  HandleGetUserId = () => {
    let userId = firebase.auth().currentUser.uid;
    return userId;
  };

  TimeOfDay = () => {
    const today = new Date();
    let time = "";
    if (
      new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        today.getHours(),
        today.getMinutes(),
        today.getSeconds()
      ) <=
      new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        11,
        59,
        59
      )
    ) {
      time = "Morning";
      return time.toLowerCase();
    } else if (
      new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        today.getHours(),
        today.getMinutes(),
        today.getSeconds()
      ) <=
      new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0, 0)
    ) {
      time = "Afternoon";
      return time.toLowerCase();
    } else {
      time = "Evening";
      return time.toLowerCase();
    }
  };

  dailyFoodProgress = () => {
    const today = new Date();
    let food = [];
    let userId = this.HandleGetUserId();
    foodCollection
      .doc(userId)
      .collection("food")
      .where(
        "createdat",
        ">",
        new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          0,
          0,
          0
        )
      )
      .where(
        "createdat",
        "<",
        new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          23,
          59,
          59
        )
      )
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          food.push(doc.data().timeOfDay);
          //console.log(doc.data().waterstatus)
        });
        console.log(food);
      });
    setTimeout(() => {
      this.setState({ foodData: food });
      console.log("fooddata=>", this.state.foodData);
      this.Dailycheck();
    }, 1000);
  };

  Dailycheck = () => {
    let check = this.state.foodData;
    for (var i = 0; i < check.length; i++) {
      if (check[i] == "morning") {
        this.setState({ morning: "true" });
      } else if (check[i] == "afternoon") {
        this.setState({ afternoon: "true" });
      } else {
        this.setState({ evening: "true" });
      }
    }
  };

  addFood = async (inputValue) => {
    console.log("gavs time to shine", this.state.timeOfDay);
    //console.log("addFood2() is being called");
    this.handleSnackbar();
    let userId = this.HandleGetUserId();
    let batch = firebase.firestore().batch();
    const today = new Date();
    const time = this.state.timeOfDay;
    console.log(time);
    const newFoodDoc = {
      updatedAt: new Date(),
      foodamount: inputValue,
      timeOfDay: time,
    };
    foodCollection
      .doc(userId)
      .collection("food")
      .where(
        "createdat",
        ">",
        new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          0,
          0,
          0
        )
      )
      .where(
        "createdat",
        "<",
        new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          23,
          59,
          59
        )
      )
      .where("timeOfDay", "==", time)
      .get()
      .then((snapshot) => {
        if (snapshot.size == 0) {
          console.log("No docs found with today's date: creating new doc");
          foodCollection.doc(userId).collection("food").add({
            createdat: new Date(),
            foodamount: inputValue,
            timeOfDay: time,
          });
          this.setState({
            error: "Your " + time + " food entry has been uploaded",
          });
        } else {
          snapshot.docs.forEach((doc) => {
            console.log("docs found with todays date", time);
            let docRef = foodCollection
              .doc(userId)
              .collection("food")
              .doc(doc.id);
            if (doc.data().timeOfDay == time) {
              batch.update(docRef, newFoodDoc);
              batch.commit().then(() => {
                this.setState({
                  error: "Your " + time + " food entry has been updated",
                });
              });
            }
          });
        }
      });
    setTimeout(() => {
      this.dailyFoodProgress();
    }, 1000);
  };

  handleSliderChange = (sliderValue) => {
    this.setState({ sliderValue });
  };

  async componentDidMount() {
    await this.dailyFoodProgress();
    setTimeout(() => {
      this.Dailycheck();
    }, 1000);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerView}>
          <Ionicons
            style={styles.headerItem}
            name="ios-menu"
            size={50}
            md="md-menu"
            onPress={() => this.props.navigation.openDrawer()}
          />
        </View>
        <View style={styles.infoContainer}>
          <TouchableOpacity onPress={this.toggleExpanded}>
            <View style={styles.header}>
              <Ionicons name="ios-information-circle" size={28} color="black" />
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={this.state.collapsed} align="center">
            <View style={styles.content}>
              <Text>Food Info</Text>
            </View>
          </Collapsible>
        </View>
        <Text>Morning {this.state.morning}</Text>
        <Text>Afternoon {this.state.afternoon}</Text>
        <Text>Evening {this.state.evening}</Text>
        <Text
          style={styles.Question}
        >{`How have you eaten ${this.TimeOfDay()}?`}</Text>
        <View style={styles.foodImages}>
          {this.state.sliderValue == 1 ? (
            <View>
              <Image
                source={require("../images/diet.png")}
                style={styles.foodImage}
              ></Image>
            </View>
          ) : null}
          {this.state.sliderValue == 2 ? (
            <View>
              <Image
                source={require("../images/burger.png")}
                style={styles.foodImage}
              ></Image>
            </View>
          ) : null}
        </View>
        <View style={styles.imageLabel}>
          {this.state.sliderValue == 1 ? (
            <View>
              <Text>Healthy</Text>
            </View>
          ) : null}
          {this.state.sliderValue == 2 ? (
            <View>
              <Text>Unhealthy</Text>
            </View>
          ) : null}
        </View>
        <Slider
          style={styles.slider}
          value={this.state.sliderValue}
          maximumValue={2}
          minimumValue={1}
          step={1}
          onValueChange={this.handleSliderChange}
        />
        <View style={styles.dropbox}>
          <DropDownPicker
            items={[
              { label: "Morning", value: "morning" },
              { label: "Afternoon", value: "afternoon" },
              { label: "Evening", value: "evening" },
            ]}
            defaultValue={this.TimeOfDay()}
            containerStyle={{ height: 30 }}
            style={{ backgroundColor: "#fafafa" }}
            itemStyle={{
              justifyContent: "flex-start",
            }}
            dropDownStyle={{ backgroundColor: "#fafafa" }}
            onChangeItem={(item) =>
              this.setState({
                timeOfDay: item.value,
              })
            }
          />
        </View>

        <View style={styles.button}>
          <TouchableNativeFeedback
            style={styles.button}
            background={TouchableNativeFeedback.Ripple("#000", true)}
            onPress={() => this.addFood(1)}
          >
            <Text style={styles.submit}>Submit</Text>
          </TouchableNativeFeedback>
        </View>
        <TouchableOpacity style={styles.skip} onPress={() => this.addFood(0)}>
          <Text style={styles.notEatenLink}>I haven't eaten yet</Text>
        </TouchableOpacity>
        <Snackbar
          visible={this.state.snackbarShow}
          onDismiss={this.onDismissSnackBar}
          action={{
            label: "OK",
            onPress: () => {
              this.setState({ snackbarShow: false });
            },
          }}
        >
          {this.state.error}
        </Snackbar>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerView: {
    marginTop: StatusBar.currentHeight - 120,
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headerItem: {
    flex: 1,
    marginLeft: 30,
  },
  button: {
    height: 50,
    width: 200,
    borderRadius: 30,
    backgroundColor: "#32a852",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  Text: {
    color: "white",
  },
  Question: {
    color: "black",
  },
  slider: {
    marginBottom: 90,
    minWidth: 300,
  },
  submit: {
    color: "white",
  },
  foodImage: {
    width: 80,
    height: 80,
  },
  foodImages: {
    minHeight: 80,
    marginBottom: 40,
    marginTop: 40,
    flexDirection: "row",
  },
  imageText: {
    marginLeft: 10,
  },
  skip: {
    marginTop: 20,
  },
  notEatenLink: {
    color: "rgb(0, 41, 130)",
    padding: 1,
    borderBottomColor: "rgb(156, 156, 156)",
    borderBottomWidth: 1,
  },
  content: {
    maxHeight: 200,
  },
  infoContainer: {
    marginTop: -60,
    marginBottom: 30,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  imageLabel: {
    marginBottom: 20,
  },
  dropbox: {
    width: 200,
    height: 50,
  },
});
