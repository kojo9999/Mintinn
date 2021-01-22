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

addWaterStatus = async (index,number) => {
// waterCollection.doc(this.HandleGetUserId()).collection('water').add({
//   createdat: new Date(),
//   waterstatus: index,
//   watertype: number
// })
// .then(function(docRef) {
//     console.log("Document written with ID: ", docRef.id);
// })
// .catch(function(error) {
//     console.error("Error adding document: ", error);
// });
const today = new Date();
waterCollection.doc(this.HandleGetUserId()).collection('water')
.where("createdat", ">", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0,0,0))
.where("createdat", "<", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23,59,59))
.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
};

render() {
    return (
    <View style={styles.container}>
    <Text style={styles.Question}>How much water have you drank today?</Text>
        {this.state.Amounts.map((number,index) => {
            return(<TouchableOpacity style={styles.button} key={index} onPress={() => this.addWaterStatus()}><Text style={styles.Text}>{number}</Text></TouchableOpacity>)
        })}
        <Text style={styles.Question}>Amout of water ive drank is : {this.state.watertype} </Text>
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
