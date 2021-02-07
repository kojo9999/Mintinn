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
const foodCollection = db().collection('profile');

export default class FoodScreen extends React.Component {
constructor() {
    super();
    this.state = {
    Amounts: ["Nothing","Unhealthy","Healthy"],
    createdat : "",
    userId: "",
    }
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

addFood2 = async (inputValue) => {
  console.log("addFood2() is being called")
  let userId = this.HandleGetUserId();
  let batch = firebase.firestore().batch()
  const today = new Date();
  const time = this.TimeOfDay();
  console.log(time)
  const newFoodDoc = {
    updatedAt: new Date(),
    foodamount: inputValue,
    timeOfDay: time
  };
  foodCollection.doc(userId).collection('food')
    .where("createdat", ">", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0,0,0))
    .where("createdat", "<", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23,59,59))
    .get().then((snapshot) => {
      if (snapshot.size == 0) {
        console.log("No docs found with today's date: creating new doc")
        foodCollection.doc(userId).collection('food').add({
          createdat: new Date(),
          foodamount: inputValue,
          timeOfDay: time
        })
      }
      else {
        snapshot.docs.forEach((doc) => {
          console.log('docs found with todays date', time)
          let docRef = foodCollection.doc(userId).collection('food').doc(doc.id)
          if(doc.data().timeOfDay == time)
          {
            batch.update(docRef, newFoodDoc)
            batch.commit().then(() => {
              console.log('food document was found')
            })
          }
        })
      } 
    })
}

HandleGetUserId=()=>{
    let userId = firebase.auth().currentUser.uid;
    return userId;
    }

render() {
    return (
    <View style={styles.container}>
    <Text style={styles.Question}>What kind of food have you eaten today?</Text>
        {this.state.Amounts.map((number,inputValue) => {
            return(<TouchableOpacity style={styles.button} key={inputValue} onPress={() => this.addFood2(inputValue)}><Text style={styles.Text}>{number}</Text></TouchableOpacity>)
        })}
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
});
