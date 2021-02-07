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
            food: [],
            sleep: []
        }
    }

    getWaterProgress = async () => {
        const today = new Date();
        let waterdata = [];
        let userId = this.HandleGetUserId();
        var waterData = this.state.water;
        waterCollection.doc(userId).collection('water')
            .where("createdat", ">", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0))
            .where("createdat", "<", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59))
            .get().then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    const newWaterData={
                        createdat: doc.data().createdat,
                        waterstatus: doc.data().waterstatus,
                    }
                    waterData.push(newWaterData); 
                })
                this.setState({water: waterData});
                console.log("check for returned Water value",this.state.water);
            })
        }

        getFoodProgress = async () => {
            const today = new Date();
            let userId = this.HandleGetUserId();
            var foodData = this.state.food;
            waterCollection.doc(userId).collection('food')
                .where("createdat", ">", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0))
                .where("createdat", "<", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59))
                .get().then((snapshot) => {
                    snapshot.docs.forEach((doc) => {
                        const newFoodData={
                            createdat: doc.data().createdat,
                            foodamount: doc.data().foodamount,
                        }
                        foodData.push(newFoodData);
                    })
                    this.setState({food: foodData})
                    console.log("check for returned Food value",this.state.food);
                })
            }

            getSleepProgress = async () => {
                const today = new Date();
                let userId = this.HandleGetUserId();
                var sleepData = this.state.sleep;
                waterCollection.doc(userId).collection('sleep')
                    .where("createdat", ">", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0))
                    .where("createdat", "<", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59))
                    .get().then((snapshot) => {
                        snapshot.docs.forEach((doc) => {
                            const newSleepData={
                                createdat: doc.data().createdat,
                                sleepamount: doc.data().sleepamount,
                            }
                            sleepData.push(newSleepData);
                        })
                        this.setState({sleep: sleepData});
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
        console.log("Check Sleep State after call:", this.state.sleep)
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Water Progress</Text>
                <Progress.Bar progress={0.17} width={200} />
                {/* <TouchableOpacity style={styles.button} onPress={() => this.CheckTodaysWater()}><Text style={styles.Text}>Test</Text></TouchableOpacity> */}
                <Text>Sleep Array Data</Text>
            {this.state.sleep.map((data, index) => {
                return(<Text style={styles.text} key={index}>{data.sleepamount}</Text>)
            })}
            <Text>Water Array Data</Text>
            {this.state.water.map((data, index) => {
                return(<Text style={styles.text} key={index}>{data.waterstatus}</Text>)
            })}
            <Text>Food Array Data</Text>
            {this.state.food.map((data, index) => {
                return(<Text style={styles.text} key={index}>{data.foodamount}</Text>)
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