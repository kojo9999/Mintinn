import React, { Component } from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import "firebase/auth";
import "firebase/firestore";
import firebase from "firebase/app";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  LineChart
} from "react-native-chart-kit";
export default class CalendarScreen extends Component {
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
    
}
  render() {

    
    return (
      <View style={styles.graphContainer}>
        <View style={styles.filters}>
          <TouchableOpacity style={styles.filterButton}><Text>1 Week</Text></TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}><Text>2 Weeks</Text></TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}><Text>1 Month</Text></TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}><Text>3 Months</Text></TouchableOpacity>
        </View>
        <Text>Sleep</Text>
        <LineChart
      
          data={{
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
              {
                data: [
                  Math.floor(Math.random() * 24),
                  Math.floor(Math.random() * 24),
                  Math.floor(Math.random() * 24),
                  Math.floor(Math.random() * 24),
                  Math.floor(Math.random() * 24),
                  Math.floor(Math.random() * 24),
                  Math.floor(Math.random() * 24),
                ],
              },
            ],
          }}
          width={Dimensions.get("window").width} // from react-native
          height={200}
          // yAxisLabel="$"
          // yAxisSuffix="k"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: "#1e1440",
            backgroundGradientFrom: "#1e1440",
            backgroundGradientTo: "#1a1138",
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
           
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#6b52bf",
            },
          }}
          bezier
          style={styles.graph}
        />
        <Text>Food</Text>
        <LineChart
      
          data={{
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
              {
                data: [
                  Math.floor(Math.random() * 6),
                  Math.floor(Math.random() * 6),
                  Math.floor(Math.random() * 6),
                  Math.floor(Math.random() * 6),
                  Math.floor(Math.random() * 6),
                  Math.floor(Math.random() * 6),
                  Math.floor(Math.random() * 6),
                ],
              },
            ],
          }}
          width={Dimensions.get("window").width} // from react-native
          height={200}
          // yAxisLabel="$"
          // yAxisSuffix="k"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: "#1d5428",
            backgroundGradientFrom: "#194522",
            backgroundGradientTo: "#1d5428",
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
           
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#579c65",
            },
          }}
          bezier
          style={styles.graph}
        />
        <Text>Water</Text>
        <LineChart
      
      
          data={{
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
              {
                data: [
                  Math.floor(Math.random() * 12),
                  Math.floor(Math.random() * 12),
                  Math.floor(Math.random() * 12),
                  Math.floor(Math.random() * 12),
                  Math.floor(Math.random() * 12),
                  Math.floor(Math.random() * 12),
                  Math.floor(Math.random() * 12),
                ],
              },
            ],
          }}
          width={Dimensions.get("window").width} // from react-native
          height={200}
          // yAxisLabel="$"
          // yAxisSuffix="k"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: "#2a4d6e",
            backgroundGradientFrom: "#213d57",
            backgroundGradientTo: "#2a4d6e",
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
           
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#5f81a1",
            },
          }}
          bezier
          style={styles.graph}
        />
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  graphContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    borderWidth: 1,
    flexDirection: "column",
  },
  graph: {
    borderRadius: 16,
    margin: 10
  },
  filters: {
    marginTop: 50,
    justifyContent: "center",
    flexDirection: "row",
  },
  filterButton: {
    padding: 5,
    margin: 1,
    backgroundColor: "gray",
    borderRadius: 10
  }
});
