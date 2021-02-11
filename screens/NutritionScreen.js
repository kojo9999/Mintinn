import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import "firebase/auth";
import "firebase/firestore";
import firebase from "firebase/app";
import { db } from "../config/config";
import Slider from "@react-native-community/slider";
import Collapsible from 'react-native-collapsible';
import {Ionicons} from '@expo/vector-icons';
const foodCollection = db().collection("profile");

export default class FoodScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      createdat: "",
      userId: "",
      sliderValue: 1,
    };
  }

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

  addFood = async (inputValue) => {
    console.log("addFood2() is being called");
    let userId = this.HandleGetUserId();
    let batch = firebase.firestore().batch();
    const today = new Date();
    const time = this.TimeOfDay();
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
      .get()
      .then((snapshot) => {
        if (snapshot.size == 0) {
          console.log("No docs found with today's date: creating new doc");
          foodCollection.doc(userId).collection("food").add({
            createdat: new Date(),
            foodamount: inputValue,
            timeOfDay: time,
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
                console.log("food document was found");
              });
            }
          });
        }
      });
  };

  handleSliderChange = (sliderValue) => {
    this.setState({ sliderValue });
  };

  render() {
    return (
      <View style={styles.container}>
          <View style={styles.infoContainer}>
       <TouchableOpacity onPress={this.toggleExpanded}>
            <View style={styles.header}>
            <Ionicons name="ios-information-circle" size={28} color="black"/>
          
            </View>
            
          </TouchableOpacity>
          <Collapsible collapsed={this.state.collapsed} align="center">
            <View style={styles.content}>
              <Text>Food Info</Text>
              
            </View>
          </Collapsible>
          </View>
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
        {this.state.sliderValue == 1? <View><Text>Healthy</Text></View>: null}
        {this.state.sliderValue == 2? <View><Text>Unhealthy</Text></View>: null}
        </View>
        <Slider
          style={styles.slider}
          value={this.state.sliderValue}
          maximumValue={2}
          minimumValue={1}
          step={1}
          onValueChange={this.handleSliderChange}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.addFood(this.state.sliderValue)}
        >
          <Text style={styles.submit}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.skip} onPress={() => this.addFood(0)}>
          <Text style={styles.notEatenLink}>I haven't eaten yet</Text>
        </TouchableOpacity>
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
  button: {
    height: 50,
    width: 200,
    borderRadius: 30,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  Text: {
    color: "white",
  },
  Question: {
    color: "black",
  },
  slider: {
    marginBottom: 80,
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
    borderBottomWidth: 1
  },
  content: {
    maxHeight: 200
  },
  infoContainer: {
    marginTop: -80,
    marginBottom: 30,
    height: 200,
    alignItems: "center",
    justifyContent: "center"
  },
  imageLabel: {
    marginBottom: 20
  }
});
