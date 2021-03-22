import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image
}
  from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Slider from "@react-native-community/slider";
import "firebase/auth";
import "firebase/firestore";
import Collapsible from 'react-native-collapsible'
import { Ionicons } from '@expo/vector-icons'
import firebase from "firebase/app";
import { db } from '../config/config'
const waterCollection = db().collection('profile');

export default class WaterScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      amount: ["none", "Small Amount", "Medium Amount", "Large Amount"],
      watertype: "",
      createdat: "",
      userId: "",
      sliderValue: 1,
      outputText: ""
    }
  }

  toggleExpanded = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };


  HandleGetUserId = () => {
    let userId = firebase.auth().currentUser.uid;
    return userId;
  }

  timeOfDay = () => {
    const today = new Date();
    let time = "";
    if (new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds()) <= new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 59, 59)) {
      time = "Morning"
      return time.toLowerCase();
    }
    else if (new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds()) <= new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0, 0)) {
      time = "Afternoon"
      return time.toLowerCase();
    }
    else {
      time = "Evening"
      return time.toLowerCase();
    }
  }

  addwater = async (inputValue) => {
    let user = this.HandleGetUserId();
    let batch = firebase.firestore().batch();
    const today = new Date();
    const time = this.timeOfDay();
    console.log(time);
    const newWaterDoc = {
      updatedAt: new Date(),
      waterstatus: inputValue,
      timeOfDay: time,
    };
    waterCollection.doc(user).collection('water')
      .where("createdat", ">", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0))
      .where("createdat", "<", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59))
      .where("timeOfDay", "==", time)
      .get()
      .then((snapshot) => {
        if (snapshot.size == 0) {
          console.log("No docs found with today's date: creating new doc");
          waterCollection.doc(user).collection("water").add({
            createdat: new Date(),
            waterstatus: inputValue,
            timeOfDay: time,
          });
          this.setState({ outputText: "Your " + time + " water entry has been uploaded" })
        } else {
          snapshot.docs.forEach((doc) => {
            console.log("docs found with todays date", time);
            let docRef = waterCollection.doc(user).collection("water").doc(doc.id);
            if (doc.data().timeOfDay == time) {
              batch.update(docRef, newWaterDoc);
              batch.commit().then(() => {
                this.setState({ outputText: "Your " + time + " water entry has been updated" })
              });
            }
          });
        }
      });
  }

  handleSliderChange = (sliderValue) => {
    this.setState({ sliderValue })
  }

  render() {
    return (

      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <TouchableOpacity onPress={this.toggleExpanded}>
            <View style={styles.header}>
              <Ionicons name="ios-information-circle" size={28} color="black" />
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={this.state.collapsed} align="center">
            <View style={styles.content}>
              <Text>Regularly drinking water:</Text>
              <Text>Helps working Joints and Muscles</Text>
              <Text>Helps cleanse your body</Text>
              <Text>Keeps your body cool</Text>
              <Text>Keeps skin healthy</Text>
            </View>
          </Collapsible>
        </View>
        <Text style={styles.Question}>{`What amount of water have you drank this ${this.timeOfDay()}?`}</Text>
        <View style={styles.waterImages}>
          <View style={styles.arrayImages}>{[...Array(this.state.sliderValue - 1)].map((e, i) => <Image source={require("../images/waterfull.png")} style={styles.waterImage} key={i}></Image>)}</View>
          {this.state.sliderValue == 1 ? <Image source={require("../images/waterempty.png")} style={styles.waterImage}></Image> : null}

        </View>
        <View style={styles.imageLabel}>
          {this.state.sliderValue == 1 ? <View><Text>None</Text></View> : null}
          {this.state.sliderValue == 2 ? <View><Text>Small</Text></View> : null}
          {this.state.sliderValue == 3 ? <View><Text>Medium</Text></View> : null}
          {this.state.sliderValue == 4 ? <View><Text>Large</Text></View> : null}
        </View>
        <Slider style={styles.slider} value={this.state.sliderValue} maximumValue={4} minimumValue={1} step={1} onValueChange={this.handleSliderChange} />
        <Text>{this.state.outputText}</Text>
        <TouchableOpacity style={styles.button} onPress={() => this.addwater(this.state.sliderValue)}><Text style={styles.submit}>Submit</Text></TouchableOpacity>
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
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center'
  },
  Text: {
    color: 'white'
  },
  Question: {
    color: 'black'
  },
  slider: {
    marginBottom: 80,
    minWidth: 300
  },
  submit: {
    color: "white"
  },
  waterImage: {

    width: 80,
    height: 80
  },
  waterImages: {
    minHeight: 80,
    marginBottom: 40,
    marginTop: 40,
    flexDirection: "column",
    justifyContent: "center"

  },
  arrayImages: {
    justifyContent: "center",
    flexDirection: "row",
  },
  imageLabel: {
    marginBottom: 20
  },
  content: {
    maxHeight: 200
  },
  infoContainer: {
    marginTop: -80,
    marginBottom: 30,
    height: 200,
    alignItems: "center",
    justifyContent: "center",

  }


});
