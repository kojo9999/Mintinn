import React, { Component } from "react";
import { View, Text, Dimensions, StyleSheet, ScrollView, StatusBar } from "react-native";
import "firebase/auth";
import "firebase/firestore";
import firebase from "firebase/app";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  LineChart
} from "react-native-chart-kit";
import { db } from '../config/config'
import { Ionicons } from "@expo/vector-icons";
const waterCollection = db().collection('profile');
export default class CalendarScreen extends Component {

  constructor() {
    super();
    this.state = {
      foodData: [],
      weeklyfoodData: [0, 0, 0, 0, 0, 0, 0],
      foodDate: [],
      waterData: [],
      weeklywaterData: [0, 0, 0, 0, 0, 0, 0],
      waterDate: [],
      sleepData: [],
      weeklySleepData: [0, 0, 0, 0, 0, 0, 0],
      startDate: "",
      endDate: ""
    }
  }

  getFoodProgress = async () => {
    const today = new Date();
    let food = []
    let userId = this.HandleGetUserId();
    let weekago = (new Date(new Date() - (86400000 * 6)))
    waterCollection.doc(userId).collection('food')
      .where("createdat", ">", new Date(weekago.getFullYear(), weekago.getMonth(), weekago.getDate(), 0, 0, 0))
      .where("createdat", "<", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59))
      .get().then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          food.push(doc.data().foodamount);
          //this.state.foodDate.push(doc.data().createdat);
          console.log(doc.data().foodamount)
        })
      })
    this.setState({ foodData: food })
  }

  getWaterProgress = async () => {
    const today = new Date();
    let water = [];
    let userId = this.HandleGetUserId();
    let weekago = (new Date(new Date() - (86400000 * 6)))
    waterCollection.doc(userId).collection('water')
      .where("createdat", ">", new Date(weekago.getFullYear(), weekago.getMonth(), weekago.getDate(), 0, 0, 0))
      .where("createdat", "<", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59))
      .get().then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          water.push(doc.data().waterstatus);
          //this.state.waterDate.push(doc.data().createdat);
          //console.log("water data",doc.data().waterstatus)
        })
      })
    this.setState({ waterData: water })
  }

  getSleepProgress = async () => {
    const today = new Date();
    let userId = this.HandleGetUserId();
    let sleep = [];
    let weekago = (new Date(new Date() - (86400000 * 6)))
    waterCollection.doc(userId).collection('sleep')
      .where("createdat", ">", new Date(weekago.getFullYear(), weekago.getMonth(), weekago.getDate(), 0, 0, 0))
      .where("createdat", "<", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59))
      .get().then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          sleep.push(doc.data().sleepamount);
          //console.log("sleep data",doc.data().sleepamount)
        })
      })
    this.setState({ sleepData: sleep });
  }

  getWeeklySleep = async () => {
    let data = this.state.sleepData;
    const empty = newdata => newdata.length = 0;
    empty(this.state.weeklySleepData)
    let day7 = Number(data[0]);
    let day6 = Number(data[1]);
    let day5 = Number(data[2]);
    let day4 = Number(data[3]);
    let day3 = Number(data[4]);
    let day2 = Number(data[5]);
    let day1 = Number(data[6]);
    if (data.length == 0) {
      this.setState({ weeklySleepData: [0, 0, 0, 0, 0, 0, 0] });
    }
    else if (data.length == 1) {
      this.setState({ weeklySleepData: [day7, 0, 0, 0, 0, 0, 0] });
    }
    else if (data.length == 2) {
      this.setState({ weeklySleepData: [day7, day6, 0, 0, 0, 0, 0] });
    }
    else if (data.length == 3) {
      this.setState({ weeklySleepData: [day7, day6, day5, 0, 0, 0, 0] });
    }
    else if (data.length == 4) {
      this.setState({ weeklySleepData: [day7, day6, day5, day4, 0, 0, 0] });
    }
    else if (data.length == 5) {
      this.setState({ weeklySleepData: [day7, day6, day5, day4, day3, 0, 0] });
    }
    else if (data.length == 6) {
      this.setState({ weeklySleepData: [day7, day6, day5, day4, day3, day2, 0] });
    }
    else {
      this.setState({ weeklySleepData: [day7, day6, day5, day4, day3, day2, day1] });
    }
  }

  getAverageFood = async () => {
    let data = this.state.foodData;
    const empty = newdata => newdata.length = 0;
    empty(this.state.weeklyfoodData)
    let day7 = Number(((data[0] + data[1] + data[2]) / 3).toFixed());
    let day6 = Number(((data[3] + data[4] + data[5]) / 3).toFixed());
    let day5 = Number(((data[6] + data[7] + data[8]) / 3).toFixed());
    let day4 = Number(((data[9] + data[10] + data[11]) / 3).toFixed());
    let day3 = Number(((data[12] + data[13] + data[14]) / 3).toFixed());
    let day2 = Number(((data[15] + data[16] + data[17]) / 3).toFixed());
    let day1 = Number(((data[18] + data[19] + data[20]) / 3).toFixed());
    if (data.length == 0) {
      this.setState({ weeklywaterData: [0, 0, 0, 0, 0, 0, 0] });
    }
    else if (data.length == 3) {
      this.setState({ weeklyfoodData: [day7, 0, 0, 0, 0, 0, 0] });
    }
    else if (data.length == 6) {
      this.setState({ weeklyfoodData: [day7, day6, 0, 0, 0, 0, 0] });
    }
    else if (data.length == 9) {
      this.setState({ weeklyfoodData: [day7, day6, day5, 0, 0, 0, 0] });
    }
    else if (data.length == 12) {
      this.setState({ weeklyfoodData: [day7, day6, day5, day4, 0, 0, 0] });
    }
    else if (data.length == 15) {
      this.setState({ weeklyfoodData: [day7, day6, day5, day4, day3, 0, 0] });
    }
    else if (data.length == 18) {
      this.setState({ weeklyfoodData: [day7, day6, day5, day4, day3, day2, 0] });
    }
    else {
      this.setState({ weeklyfoodData: [day7, day6, day5, day4, day3, day2, day1] });
    }
  };

  getAverageWater = async () => {
    let data = this.state.waterData;
    const empty = newdata => newdata.length = 0;
    empty(this.state.weeklywaterData)
    let day7 = Number(((data[0] + data[1] + data[2]) / 3).toFixed());
    let day6 = Number(((data[3] + data[4] + data[5]) / 3).toFixed());
    let day5 = Number(((data[6] + data[7] + data[8]) / 3).toFixed());
    let day4 = Number(((data[9] + data[10] + data[11]) / 3).toFixed());
    let day3 = Number(((data[12] + data[13] + data[14]) / 3).toFixed());
    let day2 = Number(((data[15] + data[16] + data[17]) / 3).toFixed());
    let day1 = Number(((data[18] + data[19] + data[20]) / 3).toFixed());
    if (data.length == 0) {
      this.setState({ weeklywaterData: [0, 0, 0, 0, 0, 0, 0] });
    }
    else if (data.length == 3) {
      this.setState({ weeklywaterData: [day7, 0, 0, 0, 0, 0, 0] });
    }
    else if (data.length == 6) {
      this.setState({ weeklywaterData: [day7, day6, 0, 0, 0, 0, 0] });
    }
    else if (data.length == 9) {
      this.setState({ weeklywaterData: [day7, day6, day5, 0, 0, 0, 0] });
    }
    else if (data.length == 12) {
      this.setState({ weeklywaterData: [day7, day6, day5, day4, 0, 0, 0] });
    }
    else if (data.length == 15) {
      this.setState({ weeklywaterData: [day7, day6, day5, day4, day3, 0, 0] });
    }
    else if (data.length == 18) {
      this.setState({ weeklywaterData: [day7, day6, day5, day4, day3, day2, 0] });
    }
    else {
      this.setState({ weeklywaterData: [day7, day6, day5, day4, day3, day2, day1] });
    }
  };

  // getAverageProgress = () => {
  //   console.log("food data =>", this.state.foodData)
  //   for (let i = 0; i < 21; i + 3) {
  //     this.state.weeklyfoodData.push(((this.state.foodData[i]) + (this.state.foodData[i + 1]) + (this.state.foodData[i + 2])) / 3);
  //   }
  //   console.log("Average data =>", this.state.weeklyfoodData)
  // }

  HandleGetUserId = () => {
    let userId = firebase.auth().currentUser.uid;
    return userId;
  };

  setDateRange = (StartDate, EndDate) => {
    this.setState({ StartDate, EndDate })
  }

  refresh = () => {
    let refreshFoodData = (this.state.foodData)
    let refreshWaterData = (this.state.waterData)
    const empty = refresh => refresh.length = 0;
    empty(refreshFoodData)
    empty(refreshWaterData)
    this.componentDidMount()
  }


  async componentDidMount() {
    await this.getWaterProgress()
    await this.getFoodProgress()
    await this.getSleepProgress()
    setTimeout(() => {
      this.getAverageFood()
      this.getAverageWater()
      this.getWeeklySleep()
    }, 1000);
  }

  render() {
    return (
      <ScrollView style={styles.graphContainer}>
        <View style={styles.graphs}>
          
          <View style={styles.navigation}>
          <Ionicons
              style={styles.headerItem}
              name="ios-menu"
              size={50}
              md="md-menu"
              onPress={() => this.props.navigation.openDrawer()}
            />
          <View style={styles.filters}>
           
            <TouchableOpacity style={styles.outterLeftFilterButton} onPress={() => this.setDateRange(Date.now(), Date.now() + 7)}><Text>1 Week</Text></TouchableOpacity>
            <TouchableOpacity style={styles.filterButton} onPress={() => this.setDateRange(Date.now(), Date.now() + 14)}><Text>2 Weeks</Text></TouchableOpacity>
            <TouchableOpacity style={styles.filterButton} onPress={() => this.setDateRange(Date.now(), Date.now() + 28)}><Text>1 Month</Text></TouchableOpacity>
            <TouchableOpacity style={styles.outterRightFilterButton} onPress={() => this.setDateRange(Date.now(), Date.now() + 84)}><Text>3 Months</Text></TouchableOpacity>
          </View>
          </View>
          
          <View style={styles.graphWrapper1}>
            <Text style={styles.graphLabel1}>Sleep</Text>
            <LineChart

              data={{
                labels: ["Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue"],
                datasets: [
                  {
                    data: this.state.weeklySleepData
                  },
                ],
              }}
              width={Dimensions.get("window").width - 30} // from react-native
              height={180}
              // yAxisLabel="$"
              // yAxisSuffix="k"
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={{
                backgroundColor: "#9582b8",
                backgroundGradientFrom: "#9582b8",
                backgroundGradientTo: "#8061ba",
                decimalPlaces: 0, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,

                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#000",
                },
              }}
              style={styles.graph1}
            />
          </View>
          <View style={styles.graphWrapper2}>
            <Text style={styles.graphLabel2}>Food</Text>
            <LineChart

              data={{
                labels: ["Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue"],
                datasets: [
                  {
                    data: this.state.weeklyfoodData
                  },
                ],
              }}
              width={Dimensions.get("window").width - 30} // from react-native
              height={180}
              // yAxisLabel="$"
              // yAxisSuffix="k"
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={{
                backgroundColor: "#86b58a",
                backgroundGradientFrom: "#86b58a",
                backgroundGradientTo: "#5eb565",
                decimalPlaces: 0, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,

                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#000",
                },
              }}
              style={styles.graph2}
            />
          </View>
          <View style={styles.graphWrapper3}>
            <Text style={styles.graphLabel3}>Water</Text>
            <LineChart
              data={{
                labels: ["Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue"],
                datasets: [
                  {
                    data: this.state.weeklywaterData
                  },
                ],
              }}
              width={Dimensions.get("window").width - 30} // from react-native
              height={180}
              // yAxisLabel="$"
              // yAxisSuffix="k"
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={{
                backgroundColor: "#80a7ad",
                backgroundGradientFrom: "#80a7ad",
                backgroundGradientTo: "#5fa3ad",
                decimalPlaces: 0, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,

                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#000",
                },
              }}
              style={styles.graph3}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}


const styles = StyleSheet.create({
  graphContainer: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  navigation: {
    width: 400,
    height: 40,
    borderRadius: 10,
    flex: 1,
    flexDirection: "row",
  },
  headerItem: {
    flex: 1,
    marginLeft: 10
  },
  graphs: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    height: 750,
    flexDirection: "column",
  },
  graphWrapper1: {
    marginTop: 5,
    backgroundColor: "#4c32a8",
    width: 400,
    borderRadius: 10,
    padding: 8,
  },
  graphWrapper2: {
    marginTop: 5,
    backgroundColor: "#4ca655",
    width: 400,
    borderRadius: 10,
    padding: 8,
  },
  graphWrapper3: {
    marginTop: 5,
    backgroundColor: "#37a9bd",
    width: 400,
    borderRadius: 10,
    padding: 8,
  },
  graphLabel1: {
    color: "white",
    marginLeft: 8,
    marginBottom: 5,
    marginTop: 5
  },
  graphLabel2: {
    color: "white",
    marginLeft: 8,
    marginBottom: 5,
    marginTop: 5
  },
  graphLabel3: {
    color: "white",
    marginLeft: 8,
    marginBottom: 5,
    marginTop: 5
  },
  graph1: {
    borderRadius: 16,
    borderColor: "#4c32a8",
    borderWidth: 2

  },
  graph2: {
    borderRadius: 16,
    borderColor: "#4ca655",
    borderWidth: 2

  },
  graph3: {
    borderRadius: 16,
    borderColor: "#37a9bd",
    borderWidth: 2

  },
  filters: {
    padding: 5,
    marginTop: 4.5,
    height: 41,
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: 10
  },
  filterButton: {
    padding: 5,
    borderColor: "#d9d9d9",
    borderWidth: 1,
    backgroundColor: "white"
  },
  outterLeftFilterButton: {
    padding: 5,
    borderColor: "#d9d9d9",
    backgroundColor: "white",
    borderWidth: 1,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10
  },
  outterRightFilterButton: {
    padding: 5,
    borderColor: "#d9d9d9",
    backgroundColor: "white",
    borderWidth: 1,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10
  }
});
