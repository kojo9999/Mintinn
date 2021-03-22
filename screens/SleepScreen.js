import React, { Component, useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Image, StatusBar } from "react-native";
import "firebase/firestore";
import * as firebase from "firebase";
import { Alert } from "react-native";
import { db } from "../config/config";
import { TouchableOpacity } from "react-native-gesture-handler";
import Collapsible from 'react-native-collapsible'
import {Ionicons} from '@expo/vector-icons'
const sleepCollection = db().collection("profile");

export default class SleepScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createdAt: "",
      sleep: 0,
      sleepInput: "",
      error: ""
    };
  }

  toggleExpanded = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  HandleGetUserId = () => {
    let userId = firebase.auth().currentUser.uid;
    return userId;
  };

  sleepValidator = () => {
    const numericRegex = /^([0-9]{1,24})+$/
    if (this.state.sleep == "") {
      this.setState({ error: "Sleep field cannot be left empty" })
      return false;
    }
    else if (numericRegex.test(this.state.sleep) == false) {
      this.setState({ error: "Sleep can only be a number" })
      return false;
    }
    else if (this.state.sleep == 0)
    {
      this.setState({ error: "Sleep must must be between 1 - 24 hours" })
      return false;
    }
    else if (this.state.sleep >= 24)
    {
      this.setState({ error: "Sleep must must be between 1 - 24 hours" })
      return false;
    }
    else
    {
      this.setState({ error: "" })
      return true;
    }
  };

  saveSleep = () => {
    let today = new Date();
    let batch = firebase.firestore().batch();
    let userId = this.HandleGetUserId();
    if (this.sleepValidator() == false) {
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
            this.setState({ error: "Your Sleep entry has been uploaded" })
          } else if (snapshot.size == 1) {
            snapshot.docs.forEach((doc) => {
              const newSleepDoc = {
                createdat: new Date(),
                sleepamount: Number(this.state.sleep),
              };
              const docRef = sleepCollection
                .doc(userId)
                .collection("sleep")
                .doc(doc.id);
              batch.update(docRef, newSleepDoc);
              batch.commit().then(() => {
              this.setState({ error: "Your Sleep entry has been updated" })
              });
            });
          }
        });
    }
  };
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
            <Ionicons name="ios-information-circle" size={28} color="black"/>
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
        <Image
          style={styles.sleepIcon}
          source={require("../images/sleeping.png")}
        ></Image>
        <Text>How long have you slept?</Text>
        <TextInput
          style={styles.input}
          placeholder="Number of hours"
          keyboardType="numeric"
          onBlur={() => this.sleepValidator()}
          onChangeText={(sleepInput) => this.setState({ sleep: sleepInput })}
        />
        <Text>{this.state.error}</Text>
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
  headerView: {
    paddingTop: StatusBar.currentHeight + -100,
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headerItem: {
    flex: 1,
    textAlign: "center",
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
