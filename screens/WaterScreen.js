import React from "react";
import { Audio } from "expo-av";
import { Snackbar } from "react-native-paper"
import {
  Text,
  View,
  StyleSheet,
  Image,
  StatusBar,
}
  from "react-native";
import { TouchableNativeFeedback, TouchableOpacity } from "react-native-gesture-handler";
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
      waterData: [],
      amount: ["none", "Small Amount", "Medium Amount", "Large Amount"],
      watertype: "",
      createdat: "",
      userId: "",
      sliderValue: 1,
      outputText: "",
      snackbarShow: false,
      morning: "None",
      afternoon: "None",
      evening: "None"
    }
  }

  handleSnackbar = () => {
    this.setState({snackbarShow: true})
    setTimeout(()=> {this.setState({snackbarShow: false})}, 3000)
  }

  onDismissSnackBar = () => {
    this.setState({snackbarShow: false})
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

  dailyWaterProgress = () => {
    const today = new Date();
    let water = [];
    let userId = this.HandleGetUserId();
    waterCollection.doc(userId).collection('water')
      .where("createdat", ">", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0))
      .where("createdat", "<", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59))
      .get().then((snapshot) => {
        snapshot.docs.forEach((doc) => {
        water.push(doc.data().timeOfDay);
        //console.log(doc.data().waterstatus)
      })
      console.log(water)
    })  
    setTimeout(() => {
    this.setState({ waterData: water })
    console.log("waterdata=>",this.state.waterData)
    }, 1000);
    this.Dailycheck()
  }

  addwater = async (inputValue) => {
    this.handleSnackbar()
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
      this.dailyWaterProgress()
  }

  Dailycheck = () =>{
    let check = this.state.waterData
    for(var i = 0; i < check.length; i++)
    {
      if(check[i] == "morning" )
      {
        this.setState({morning: "true"})
      }
      else if(check[i] == "afternoon" )
      {
        this.setState({afternoon: "true"})
      }
      else
      {
        this.setState({evening: "true"})
      }
    }
  }
  
  async componentDidMount() {
    await this.dailyWaterProgress()
    setTimeout(() => {
    this.Dailycheck()
    }, 1000);
  }

  handleSliderChange = (sliderValue) => {
    this.setState({ sliderValue })
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
              <Text>Regularly drinking water:</Text>
              <Text>Helps working Joints and Muscles</Text>
              <Text>Helps cleanse your body</Text>
              <Text>Keeps your body cool</Text>
              <Text>Keeps skin healthy</Text>
            </View>
          </Collapsible>
        </View>
        <Text>Morning {this.state.morning}</Text>
        <Text>Afternoon {this.state.afternoon}</Text>
        <Text>Evening {this.state.evening}</Text>
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

        <View style={styles.button}><TouchableNativeFeedback style={styles.button} background={TouchableNativeFeedback.Ripple('#000', true)} onPress={() => this.addwater(this.state.sliderValue)}><Text style={styles.submit}>Submit</Text></TouchableNativeFeedback></View>
        <Snackbar
        visible={this.state.snackbarShow}
        onDismiss={this.onDismissSnackBar}
          action={{
          label: 'OK',
          onPress: () => {
            this.setState({snackbarShow: false})
          },
        }}>
        {this.state.outputText}
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
    marginTop: StatusBar.currentHeight -120 ,
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headerItem: {
    flex: 1,
    marginLeft: 30
  },
  button: {
    height: 50,
    width: 200,
    borderRadius: 30,
    backgroundColor: '#32a852',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  Text: {
    color: 'white'
  },
  Question: {
    color: 'black'
  },
  slider: {
    marginBottom: 140,
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
    marginTop: -60,
    marginBottom: 30,
    height: 200,
    alignItems: "center",
    justifyContent: "center",

  }


});