import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Progress from "react-native-progress";
import "firebase/auth";
import "firebase/firestore";
import firebase from "firebase/app";
import { db } from '../config/config'
import {
    YAxis,
    XAxis,
    Grid,
    AreaChart,
  } from "react-native-svg-charts";
import * as shape from "d3-shape";
const waterCollection = db().collection('profile');

export default class CalendarScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            foodData: [],
            foodDate: [],
            waterData: [],
            waterDate: [],
            sleep: []
        }
    }

    getFoodProgress = async () => {
      const today = new Date();
      let userId = this.HandleGetUserId();
      waterCollection.doc(userId).collection('food')
          .where("createdat", ">", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0))
          .where("createdat", "<", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59))
            .get().then((snapshot) => {
              snapshot.docs.forEach((doc) => {
                this.state.foodData.push(doc.data().foodamount);
                this.state.foodDate.push(doc.data().createdat);
                console.log(doc.data().foodamount)
              })
          })
      }

    getWaterProgress = async () => {
        const today = new Date();
        let userId = this.HandleGetUserId();
        waterCollection.doc(userId).collection('water')
            .where("createdat", ">", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0))
            .where("createdat", "<", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59))
            .get().then((snapshot) => {
              snapshot.docs.forEach((doc) => {
                this.state.waterData.push(doc.data().waterstatus);
                this.state.waterDate.push(doc.data().createdat);
                console.log(doc.data().waterstatus)
              })
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
                        // console.log("check for returned Sleep value",this.state.sleep);
                    })
                }

    HandleGetUserId = () => {
        let userId = firebase .auth().currentUser.uid;
        return userId;
    };

    async componentDidMount () {
        await  this.getWaterProgress()
        await  this.getFoodProgress()
        await  this.getSleepProgress()
        console.log("water here boi =>",this.state.waterData)
        console.log("food here boi =>",this.state.foodData)
    }
    render() {
        const dataSleep = [1];
        return (
          <View style={styles.viewWrapper}>
            <View style={styles.statsContainer}>
               <Text style={styles.chartTitle}>Sleep</Text>
              <AreaChart
                style={styles.areaChart}
                data={dataSleep}
                contentInset={{ top: 20, bottom: 20 }}
                curve={shape.curveNatural}
                svg={{ fill: "rgba(169, 64, 245, 0.8)" }}
              >
               
              </AreaChart>
            </View>
            <View style={styles.statsContainer}>
            <Text style={styles.chartTitle}>Food</Text>
              <AreaChart
                style={styles.areaChart}
                data={this.state.foodData}
                contentInset={{ top: 20, bottom: 20 }}
                curve={shape.curveNatural}
                svg={{ fill: "rgba(64, 247, 147, 0.8)" }}
              >
               
              </AreaChart>
            </View>
            <View style={styles.statsContainer}>
            <Text style={styles.chartTitle}>Water</Text>
              <AreaChart
                style={styles.areaChart}
                data={this.state.waterData}
                contentInset={{ top: 20, bottom: 20 }}
                curve={shape.curveNatural}
                svg={{ fill: "rgba(64, 146, 247, 0.8)" }}
              >
                
              </AreaChart>
            </View>
          </View>
        );
      }
    }
    
    const styles = StyleSheet.create({
      viewWrapper: {
        height: "100%",
        margin: 20,
      },
      statsContainer: {
        height: 150,
        marginBottom: 20
      },
      areaChart: {
        flex: 1,
        height: 150,
        borderColor: "rgba(196, 196, 196, 0.8)",
        borderRadius: 10,
        overflow: "hidden",
        borderWidth: 1,
        
      },
      chartTitle: {
          marginBottom: 10
      }
    });