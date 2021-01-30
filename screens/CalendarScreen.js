import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
// import * as Progress from "react-native-progress";
import { TouchableOpacity } from "react-native-gesture-handler";
import "firebase/auth";
import "firebase/firestore";
import firebase from "firebase/app";
import { db } from '../config/config'
const waterCollection = db().collection('profile');

export default class CalendarScreen extends React.Component {
    constructor() {
        super();
        this.state = {
        }
    }

    getWaterProgress = async () => {
        const today = new Date();
        waterCollection.doc(this.HandleGetUserId()).collection('water')
            .where("createdat", ">", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0))
            .where("createdat", "<", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59))
            .get().then(function (querySnapshot) {
                querySnapshot.docs.forEach((doc) => {
                    console.log(doc.id, " => ", doc.data(waterstatus));

                })
        })
    }


    HandleGetUserId = () => {
        let userId = firebase.auth().currentUser.uid;
        return userId;
    };

    render() {
        return (
            <View style={StyleSheet.container}>
                <Text>Water Progress</Text>
                <Progress.Bar progress={0.17} width={200} />
                <TouchableOpacity style={styles.button} onPress={() => this.getWaterProgress()}><Text style={styles.Text}>Test</Text></TouchableOpacity>
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
});
