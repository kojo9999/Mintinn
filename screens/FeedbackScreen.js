import React from "react";
import { Text, View, ScrollView, StyleSheet, Image,Linking } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import "firebase/auth";
import "firebase/firestore";
import firebase from "firebase/app";
import { db } from "../config/config";
import Collapsible from 'react-native-collapsible';
import { Ionicons } from '@expo/vector-icons';
import { Card, ListItem, Button, Icon } from 'react-native-elements'
const waterCollection = db().collection("profile");

export default class FeedbackScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      foodData: [],
      foodAverage: 0,
      waterData: [],
      waterAverage: 0,
      waterDate: [],
      sleepData: [0,0,0,0,0,0,0],
      sleepAverage: 0,
      startDate: "",
      endDate: "",
      feedbackCard: <Text>No Feedback Right Now</Text>
    };
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
        })
      })
      this.setState({foodData: food})
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
        })
      })
      this.setState({waterData: water})
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
        })
      })
      this.setState({sleepData: sleep});
  }

  getAverageFood = async () => {
    let data = this.state.foodData;
    const empty = newdata => newdata.length = 0;
    let day7 = Number(((data[0] + data[1] + data[2]) / 3).toFixed());
    let day6 = Number(((data[4] + data[4] + data[5]) / 3).toFixed());
    let day5 = Number(((data[6] + data[7] + data[8]) / 3).toFixed());
    let day4 = Number(((data[9] + data[10] + data[11]) / 3).toFixed());
    let day3 = Number(((data[12] + data[13] + data[14]) / 3).toFixed());
    let day2 = Number(((data[15] + data[16] + data[17]) / 3).toFixed());
    let day1 = Number(((data[18] + data[19] + data[20]) / 3).toFixed());
    let average = (day7 + day6 + day5 + day4 + day3 + day2 + day1)/14
    this.setState({foodAverage: average});
  };

  getAverageWater = async () => {
    let data = this.state.waterData;
    const empty = newdata => newdata.length = 0;
    let day7 = Number(((data[0] + data[1] + data[2]) / 3).toFixed());

    let day6 = Number(((data[4] + data[4] + data[5]) / 3).toFixed());
    let day5 = Number(((data[6] + data[7] + data[8]) / 3).toFixed());
    let day4 = Number(((data[9] + data[10] + data[11]) / 3).toFixed());
    let day3 = Number(((data[12] + data[13] + data[14]) / 3).toFixed());
    let day2 = Number(((data[15] + data[16] + data[17]) / 3).toFixed());
    let day1 = Number(((data[18] + data[19] + data[20]) / 3).toFixed());
    let average = (day7 + day6 + day5 + day4 + day3 + day2 + day1)/14
    this.setState({waterAverage: average});
  };

  getAverageSleep = async () => {
    let data = this.state.sleepData;
    const empty = newdata => newdata.length = 0;
    let average = (data[0] + data[1] + data[2] + data[3] + data[4] + data[5] + data[6])/56
    console.log("sleep", data)
    this.setState({sleepAverage: average});
    
  };

  getLowestAverage = async() => {

    let averages = [this.state.sleepAverage-1,this.state.waterAverage-1,this.state.foodAverage-1]
    let words = ["sleep","water","food"]
    let worst = Math.min(averages[0],averages[1],averages[2])
    console.log("worst", worst)
    let lowest = ""

    for(let i=0;i<3;i++)
    {
      if(averages[i]== worst)
      {
        lowest = words[i]
      }
      
    }

    console.log("lowest: ", lowest)

 

    if(lowest == "sleep")
    {
     
      this.setState({feedbackCard: <Card>
        <Card.Title>Sleep Advice</Card.Title>
          <Card.Image source={require('../images/water.jpg')}>
            <Text style={{marginBottom: 75}}>
              Your water intake seems to be below average. Why not look for info below from HSE?
            </Text>
            <Button
                icon={<Icon name='code' color='#ffffff' />}
                buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                title='Visit HSE'
              onPress={ ()=> Linking.openURL('https://www.hse.ie') }/>
          </Card.Image>
    </Card>}) 
    }
  else if(lowest == "water")
  {
    
    this.setState({feedbackCard: <Card>
      <Card.Title>Water Advice</Card.Title>
        <Card.Image source={require('../images/water.jpg')}>
          <Text style={{marginBottom: 75}}>
            Your water intake seems to be below average. Why not look for info below from HSE?
          </Text>
          <Button
              icon={<Icon name='code' color='#ffffff' />}
              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
              title='Visit HSE'
            onPress={ ()=> Linking.openURL('https://www.hse.ie') }/>
        </Card.Image>
  </Card>} )
  }
  else if(lowest == "food")
  {

    this.setState({feedbackCard: <Card>
      <Card.Title>Food Advice</Card.Title>
      <Text style={{marginBottom: 10}}>
            Your food intake seems to be that of a 5 year old. Why not look for info below from HSE?
          </Text>
        <Card.Image source={require('../images/food.jpg')}>
          <Button
              icon={<Icon name='code' color='#ffffff' />}
              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
              title='Visit HSE'
            onPress={ ()=> Linking.openURL('https://www.hse.ie') }/>
        </Card.Image>
  </Card>} )
    
  } 
 }

    componentDidMount() {
      this.getFoodProgress()
      this.getWaterProgress()
      this.getSleepProgress()
    
      setTimeout(() => {
        this.getAverageFood()
        this.getAverageWater()
        this.getAverageSleep()
        this.getLowestAverage()
      }, 1000);
     
      
    }

    


  HandleGetUserId = () => {
    let userId = firebase.auth().currentUser.uid;
    return userId;
  };

  TimeOfDay = () => {
    const today = new Date();
    let time = "";
    if (
      new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        today.getHours(),
        today.getMinutes(),
        today.getSeconds()
      ) <=
      new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        11,
        59,
        59
      )
    ) {
      time = "Morning";
      return time.toLowerCase();
    } else if (
      new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        today.getHours(),
        today.getMinutes(),
        today.getSeconds()
      ) <=
      new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0, 0)
    ) {
      time = "Afternoon";
      return time.toLowerCase();
    } else {
      time = "Evening";
      return time.toLowerCase();
    }
  };


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <TouchableOpacity onPress={this.toggleExpanded}>
            <View style={styles.header}>
              <Ionicons name="ios-information-circle" size={28} color="black" />

            </View>
          </TouchableOpacity>

          <Collapsible collapsed={this.state.collapsed} align="center">
            <View style={styles.content}>
              <Text>View Your Customized Daily Feedback Here</Text>
            </View>
          </Collapsible>
          <Image source={require("../images/feedback.png")} style={styles.foodImage}></Image>
        </View>

        <View style={styles.content}>
        <Text style={styles.Question}>
          {`Your Newest Feedback`}
       </Text>
        </View>

        <ScrollView>
        {this.state.feedbackCard}
        </ScrollView>
        


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
  button: {
    height: 50,
    width: 200,
    borderRadius: 30,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  Text: {
    color: "white",
  },
  Question: {
    color: "black",
  },
  slider: {
    marginBottom: 80,
    minWidth: 300,
  },
  submit: {
    color: "white",
  },
  foodImage: {
    width: 110,
    height:110,
    marginLeft: 10,
    marginTop:80
  },
  imageText: {
    marginLeft: 10,
  },
  skip: {
    marginTop: 20,
  },
  content: {
    maxHeight: 200
  },
  infoContainer: {
    marginTop: -80,
    marginBottom: 30,
    height: 200,
    alignItems: "center",
    justifyContent: "center"
  },
  imageLabel: {
    marginBottom: 20
  }
});