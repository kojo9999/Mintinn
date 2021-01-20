import React, {Component, useState} from "react";
import {View, Text, StyleSheet, TextInput, Button} from "react-native";
import 'firebase/firestore';
import * as firebase from 'firebase';
import {Alert} from "react-native";
import {db} from '../config/config'

export default class SleepScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
                createdAt: "",
                sleep: "",
                sleepInput: ""
        }
        db.collection('test').get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
                console.log(doc.data())
                this.setState({
                        createdAt: doc.data().createdAt,
                        sleep: doc.data().sleep
                })
            })
        })
    }

    /*async getSleep() {
        const sleepInfo = [];
        await db.collection('test').get().then(snapshot => {
            snapshot.docs.forEach(doc => {
                sleepInfo.push({createdAt: doc.createdAt, sleep: doc.sleep})
            })
        })
        console.log(sleepInfo)
        return sleepInfo;
    }*/

    saveSleep = () => {
        db.collection('test').add({
            createdAt: new Date(),
            sleep: this.state.sleep
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