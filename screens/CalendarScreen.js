import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Progress from "react-native-progress";
import "firebase/auth";
import "firebase/firestore";
import firebase from "firebase/app";
import { db } from '../config/config'
const waterCollection = db().collection('profile');

export default class CalendarScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            water: [],
            sleep: [],
            food: []
        }
    }

    getWaterProgress = async () => {
        const today = new Date();
        let userId = this.HandleGetUserId();
        waterCollection.doc(userId).collection('water')
            .where("createdat", ">", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0))
            .where("createdat", "<", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59))
            .get().then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    const newWaterData={
                        createdat: doc.data().createdat,
                        waterstatus: doc.data().waterstatus,
                    }
                    this.state.water.push(newWaterData); 
                })
                console.log("check for returned Water value",this.state.water);
            })
        }

        getFoodProgress = async () => {
            const today = new Date();
            let userId = this.HandleGetUserId();
            waterCollection.doc(userId).collection('food')
                .where("createdat", ">", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0))
                .where("createdat", "<", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59))
                .get().then((snapshot) => {
                    snapshot.docs.forEach((doc) => {
                        const newFoodData={
                            createdat: doc.data().createdat,
                            foodstatus: doc.data().foodstatus,
                        }
                        this.state.food.push(newFoodData); 
                    })
                    console.log("check for returned Food value",this.state.food);
                })
            }

            getSleepProgress = async () => {
                const today = new Date();
                let userId = this.HandleGetUserId();
                waterCollection.doc(userId).collection('sleep')
                    .where("createdat", ">", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0))
                    .where("createdat", "<", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59))
                    .get().then((snapshot) => {
                        snapshot.docs.forEach((doc) => {
                            const newSleepData={
                                createdat: doc.data().createdat,
                                sleepstatus: doc.data().sleepstatus,
                            }
                            this.state.sleep.push(newSleepData); 
                        })
                        console.log("check for returned Sleep value",this.state.sleep);
                    })
                }

    HandleGetUserId = () => {
        let userId = firebase .auth().currentUser.uid;
        return userId;
    };

    componentDidMount() {
        this.getWaterProgress()
        this.getSleepProgress()
        this.getFoodProgress()
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Water Progress</Text>
                <Progress.Bar progress={0.17} width={200} />
                {/* <TouchableOpacity style={styles.button} onPress={() => this.CheckTodaysWater()}><Text style={styles.Text}>Test</Text></TouchableOpacity> */}
                {this.state.water.map((data,index) => {
            return(<Text style={styles.Text} key={index}>{data}</Text>)
            })}
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
    Text:{
        color:'black'
      },
});