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
import firebase from "firebase/app";
import {db} from '../config/config'
const waterCollection = db().collection('profile');

export default class WaterScreen extends React.Component {
constructor() {
    super();
    this.state = {
    Amounts: ["none","Small Amount","Medium Amount","Large Amount"],
    watertype: "",
    createdat : "",
    userId: "",
    sliderValue: 1,
    }
} 

  HandleGetUserId=()=>{
    let userId = firebase.auth().currentUser.uid;
    return userId;
  }

  TimeOfDay=()=>{
    const today = new Date();
    let time = "";
    if(new Date(today.getFullYear(), today.getMonth(), today.getDate(),today.getHours(), today.getMinutes(), today.getSeconds()) <= new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11,59,59))
    {
      time = "Morning"
      return time.toLowerCase();
    }
    else if (new Date(today.getFullYear(), today.getMonth(), today.getDate(),today.getHours(), today.getMinutes(), today.getSeconds()) <= new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18,0,0))
    {
      time = "Afternoon"
      return time.toLowerCase();
    }
    else
    {
      time = "Evening"
      return time.toLowerCase();
    }
}

  CheckTodaysWater = async (InputValue) => {
  const today = new Date();
  let addwater = (check) => this.addWaterStatus(InputValue ,check)
  waterCollection.doc(this.HandleGetUserId()).collection('water')
  .where("createdat", ">", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0,0,0))
  .where("createdat", "<", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23,59,59))
  .get().then(function(querySnapshot) {
    console.log(querySnapshot.size)
          if(querySnapshot.size == 0)
          {
            addwater(false);
          }
          else
          {
            addwater(true);
          }
      })
  };

  addWaterStatus = async (InputValue, check) => {
    const newDocumentBody = {
      updatedat: new Date(),
      waterstatus: InputValue,
    };
    let time = this.TimeOfDay();
    let user = this.HandleGetUserId();
    let batch = firebase.firestore().batch()
    const today = new Date();
    console.log(check)
    if(check == true && time == "Morning")
    {
      waterCollection.doc(user).collection('water')
      .where("createdat", ">", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0,0,0))
      .where("createdat", "<", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23,59,59))
      .where("timeofday", "==", "Morning")
      .get().then(function(querySnapshot) {
        console.log(querySnapshot.size)
              if(querySnapshot.size == 0)
              {
                waterCollection.doc(user).collection('water').add({
                  createdat: new Date(),
                  waterstatus: InputValue,
                  timeofday: time,
                })
              }
              else
              {
                waterCollection.doc(user).collection('water')
                .where("createdat", ">", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0,0,0))
                .where("createdat", "<", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23,59,59))
                .where("timeofday", "==", "Morning")
                .get().then(function(querySnapshot) {
                  querySnapshot.docs.forEach((doc) => {
                    console.log(doc.id, " => ", doc.data());
                    const docRef = waterCollection.doc(user).collection('water').doc(doc.id)
                    batch.update(docRef, newDocumentBody)
                  })
                    batch.commit().then(() => {
                    console.log('Morning water document was found and has been updated')
                  })
                })
              }
          })
    
  }
  else if(check == true && time == "Mid-day")
    {
      waterCollection.doc(user).collection('water')
      .where("createdat", ">", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0,0,0))
      .where("createdat", "<", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23,59,59))
      .where("timeofday", "==", "Mid-day")
      .get().then(function(querySnapshot) {
        console.log(querySnapshot.size)
          if(querySnapshot.size == 0)
          {
            waterCollection.doc(user).collection('water').add({
              createdat: new Date(),
              waterstatus: InputValue,
              timeofday: time,
            })
          }
          else
          {
            waterCollection.doc(user).collection('water')
            .where("createdat", ">", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0,0,0))
            .where("createdat", "<", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23,59,59))
            .where("timeofday", "==", "Mid-day")
            .get().then(function(querySnapshot) {
              querySnapshot.docs.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
                const docRef = waterCollection.doc(user).collection('water').doc(doc.id)
                batch.update(docRef, newDocumentBody)
              })
                batch.commit().then(() => {
                console.log('Mid-day water document was found and has been updated')
              })
            })
          }
      })
  }
  else
    {
      waterCollection.doc(user).collection('water')
      .where("createdat", ">", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0,0,0))
      .where("createdat", "<", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23,59,59))
      .where("timeofday", "==", "Night")
      .get().then(function(querySnapshot) {
        console.log(querySnapshot.size)
          if(querySnapshot.size == 0)
          {
            waterCollection.doc(user).collection('water').add({
              createdat: new Date(),
              waterstatus: InputValue,
              timeofday: time,
            })
          }
          else
          {
            waterCollection.doc(user).collection('water')
            .where("createdat", ">", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0,0,0))
            .where("createdat", "<", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23,59,59))
            .where("timeofday", "==", "Night")
            .get().then(function(querySnapshot) {
              querySnapshot.docs.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
                const docRef = waterCollection.doc(user).collection('water').doc(doc.id)
                batch.update(docRef, newDocumentBody)
              })
                batch.commit().then(() => {
                console.log('Night water document was found and has been updated')
              })
            })
          }
      })
  }
}


handleSliderChange = (sliderValue) => {
   this.setState({sliderValue})
}

render() {
    return (
    <View style={styles.container}>
    <Text style={styles.Question}>{`How much water have you drank this ${this.TimeOfDay()} ?`}</Text>
    <View style={styles.waterImages}>
    {[...Array(this.state.sliderValue - 1)].map((e, i) => <Image source={require("../images/water.png")} style={styles.waterImage} key={i}></Image>)}
    </View>
    
      {/* <TouchableOpacity style={styles.button} onPress={() => this.CheckTodaysWater(InputValue)}></TouchableOpacity>    */}
      <Slider style={styles.slider} value={this.state.sliderValue} maximumValue={4} minimumValue={1} step={1} onValueChange={this.handleSliderChange}/>
      <TouchableOpacity style={styles.button} onPress={() => this.CheckTodaysWater(this.state.sliderValue)}><Text style={styles.submit}>Submit</Text></TouchableOpacity>
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
  button:{
    height:50,
    width:200,
    borderRadius:30,
    backgroundColor:'black',
    justifyContent:'center',
    alignItems:'center'
  },
  Text:{
    color:'white'
  },
  Question:{
    color:'black'
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
    minHeight:80,
    marginBottom: 40,
    marginTop: 40,
    flexDirection: "row",
    
  }


});
