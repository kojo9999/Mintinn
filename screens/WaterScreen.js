import React from "react";
import {
  Text,
  View,
  StyleSheet,
} 
from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
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
    userId: ""
    
    }
} 

  HandleGetUserId=()=>{
    let userId = firebase.auth().currentUser.uid;
    return userId;
  }

  TimeOfDay=()=>{
    const today = new Date();
    let time = "Night";
    return time;
}

  CheckTodaysWater = async (index, number) => {
  const today = new Date();
  let addwater = (check) => this.addWaterStatus(index, number, check)
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

  addWaterStatus = async (index, number, check) => {
    const newDocumentBody = {
      updatedat: new Date(),
      waterstatus: index,
      watertype: number,
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
                  waterstatus: index,
                  watertype: number,
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
      waterCollection.doc(this.HandleGetUserId()).collection('water')
      .where("createdat", ">", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0,0,0))
      .where("createdat", "<", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23,59,59))
      .where("timeofday", "==", "Mid-day")
      .get().then(function(querySnapshot) {
        console.log(querySnapshot.size)
          if(querySnapshot.size == 0)
          {
            waterCollection.doc(user).collection('water').add({
              createdat: new Date(),
              waterstatus: index,
              watertype: number,
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
      waterCollection.doc(this.HandleGetUserId()).collection('water')
      .where("createdat", ">", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0,0,0))
      .where("createdat", "<", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23,59,59))
      .where("timeofday", "==", "Night")
      .get().then(function(querySnapshot) {
        console.log(querySnapshot.size)
          if(querySnapshot.size == 0)
          {
            waterCollection.doc(user).collection('water').add({
              createdat: new Date(),
              waterstatus: index,
              watertype: number,
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

render() {
    return (
    <View style={styles.container}>
    <Text style={styles.time}>{this.TimeOfDay()}</Text>
    <Text style={styles.Question}>How much water have you drank today?</Text>
        {this.state.Amounts.map((number,index) => {
            return(<TouchableOpacity style={styles.button} key={index} onPress={() => this.CheckTodaysWater(index, number)}><Text style={styles.Text}>{number}</Text></TouchableOpacity>)
        })}
        {/* <Text style={styles.Question}>Amout of water ive drank is : {this.state.watertype} </Text> */}
    </View>
    );
}
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  button:{
    height:50,
    width:200,
    borderRadius:30,
    marginBottom:10,
    backgroundColor:'blue',
    justifyContent:'center',
    alignItems:'center'
  },
  Text:{
    color:'white'
  },
  Question:{
    color:'black'
  },
  time:{
    fontSize: 20
  },
});
