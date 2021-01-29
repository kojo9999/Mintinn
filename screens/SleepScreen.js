import React, {Component, useState} from "react";
import {View, Text, StyleSheet, TextInput, Button} from "react-native";
import 'firebase/firestore';
import * as firebase from 'firebase';
import {Alert} from "react-native";
import {db} from '../config/config'
const sleepCollection = db().collection('profile');

export default class SleepScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
                createdAt: "",
                sleep: "",
                sleepInput: ""
        }
    }

    HandleGetUserId=()=>{
        let userId = firebase.auth().currentUser.uid;
        return userId;
      }

    saveSleep = () => {
        let today = new Date();
        let batch = firebase.firestore().batch();
        let userId = this.HandleGetUserId();
        sleepCollection.doc(userId).collection('sleep')
        .where('createdat', '>', new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0))
        .where('createdat', '<', new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59))
        .get().then((snapshot) => {
            console.log('Sleep Doc instances retrieved:', snapshot.size)
            if(snapshot.size == 0) {
                sleepCollection.doc(userId).collection('sleep').add({
                    createdat: new Date(),
                    sleepamount: this.state.sleep
                })
            }
            else if(snapshot.size == 1) {
                snapshot.docs.forEach((doc) => {
                const newSleepDoc = {
                    createdat: new Date(),
                    sleepamount: this.state.sleep
                };
                const docRef = sleepCollection.doc(userId).collection('sleep').doc(doc.id)
                batch.update(docRef, newSleepDoc)
                batch.commit().then(() => {
                    console.log('Sleep document was found and has been updated')
                  })
                })
            }
        })
    }
    render() {
        let input = '';
        const saveSleepInput = sleepInput => {
            const input = sleepInput;
            return input;
        };

        return (
            <View style={styles.container}>
                <Text>Enter Input</Text>
                <TextInput style={styles.input} placeholder='e.g. 8' onChangeText={sleepInput => this.setState({sleep: sleepInput})}/>
                <Button title='Save to Firestore' onPress={() => this.saveSleep()}></Button>
                <Text>Hours of Sleep: {this.state.sleep} </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        borderWidth: 1,
        borderColor: '#777',
        padding: 8,
        margin: 10,
        width: 200,
    }
});