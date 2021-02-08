import React, { Component, useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Image } from "react-native";
import "firebase/firestore";
import * as firebase from "firebase";
import { Alert } from "react-native";
import { db } from "../config/config";
import { TouchableOpacity } from "react-native-gesture-handler";
const sleepCollection = db().collection("profile");

export default class SleepScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createdAt: "",
      sleep: "",
      sleepInput: "",
    };
  }

  HandleGetUserId = () => {
    let userId = firebase.auth().currentUser.uid;
    return userId;
  };

  saveSleep = () => {
    let today = new Date();
    let batch = firebase.firestore().batch();
    let userId = this.HandleGetUserId();
    if (this.state.sleep == 0) {
      Alert.alert("Alert", "Sleep must must be between 1 - 24 hours ");
      return;
    } else if (this.state.sleep >= 24) {
      Alert.alert("Alert", "Sleep must must be between 1 - 24 hours ");
      return;
    } else {
      sleepCollection
        .doc(userId)
        .collection("sleep")
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
          console.log("Sleep Doc instances retrieved:", snapshot.size);
          if (snapshot.size == 0) {
            sleepCollection.doc(userId).collection("sleep").add({
              createdat: new Date(),
              sleepamount: this.state.sleep,
            });
          } else if (snapshot.size == 1) {
            snapshot.docs.forEach((doc) => {
              const newSleepDoc = {
                createdat: new Date(),
                sleepamount: this.state.sleep,
              };
              const docRef = sleepCollection
                .doc(userId)
                .collection("sleep")
                .doc(doc.id);
              batch.update(docRef, newSleepDoc);
              batch.commit().then(() => {
                console.log("Sleep document was found and has been updated");
              });
            });
          }
        });
    }
  };
  render() {
    let input = "";
    const saveSleepInput = (sleepInput) => {
      const input = sleepInput;
      return input;
    };

    return (
      <View style={styles.container}>
        <Image
          style={styles.sleepIcon}
          source={require("../images/sleeping.png")}
        ></Image>
        <Text>How long have you slept?</Text>
        <TextInput
          style={styles.input}
          placeholder="Number of hours"
          keyboardType="numeric"
          onChangeText={(sleepInput) => this.setState({ sleep: sleepInput })}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.saveSleep()}
        >
          <Text style={styles.submit}>Submit</Text>
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
  input: {
    borderBottomColor: "black",
    borderBottomWidth: 1,
    padding: 8,
    margin: 10,
    width: 200,
    marginBottom: 40,
    marginTop: 40,
  },
  button: {
    height: 50,
    width: 200,
    borderRadius: 30,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  submit: {
    color: "white",
  },
  sleepIcon: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
});
