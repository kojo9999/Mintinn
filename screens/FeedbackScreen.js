import React from "react";
import { Text, View, ScrollView, StyleSheet, Image,Linking, StatusBar} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import "firebase/auth";
import "firebase/firestore";
import firebase from "firebase/app";
import { db } from "../config/config";
import Collapsible from 'react-native-collapsible';
import { Ionicons } from '@expo/vector-icons';
import { Card, ListItem, Button, Icon } from 'react-native-elements'
const waterCollection = db().collection("profile");
import ProgressCircle from 'react-native-progress-circle'

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
      sleepdates:[],
      fooddates:[],
      waterdates:[],
      sleepstreak:0,
      foodstreak:0,
      waterstreak:0,
      feedbackCard: <Text>No Feedback Right Now</Text>,
      goodFeedbackCard: <Text>No Feedback Right Now</Text>,
      streakCard: <Text>No Feedback Right Now</Text>
    };
  }

  getFoodProgress = async () => {
    const today = new Date();
    let food = []
    let fooddate = [] 
    let userId = this.HandleGetUserId();
    let weekago = (new Date(new Date() - (86400000 * 6)))
    waterCollection.doc(userId).collection('food')
      .where("createdat", ">", new Date(weekago.getFullYear(), weekago.getMonth(), weekago.getDate(), 0, 0, 0))
      .where("createdat", "<", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59))
      .get().then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          food.push(doc.data().foodamount);
          fooddate.push(doc.data().createdat.seconds)
        })
      })
      this.setState({foodData: food}) 
      this.setState({fooddates: fooddate})
    }

  getWaterProgress = async () => {
    const today = new Date();
    let water = [];
    let waterdate = []
    let userId = this.HandleGetUserId();
    let weekago = (new Date(new Date() - (86400000 * 7)))
    waterCollection.doc(userId).collection('water')
      .where("createdat", ">", new Date(weekago.getFullYear(), weekago.getMonth(), weekago.getDate(), 0, 0, 0))
      .where("createdat", "<", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59))
      .get().then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          water.push(doc.data().waterstatus);
          waterdate.push(doc.data().createdat.seconds)
        })
      })
      this.setState({waterData: water})
      this.setState({waterdates: waterdate})
      
  }

  getSleepProgress = async () => {
    const today = new Date();
    let userId = this.HandleGetUserId();
    let sleep = [];
    let sleepdate = []
    let weekago = (new Date(new Date() - (86400000 * 6)))
    waterCollection.doc(userId).collection('sleep')
    .where("createdat", ">", new Date(weekago.getFullYear(), weekago.getMonth(), weekago.getDate(), 0, 0, 0))
    .where("createdat", "<", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59))
      .get().then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          sleep.push(doc.data().sleepamount);
          sleepdate.push(doc.data().createdat.seconds)
        })
      })
      this.setState({sleepData: sleep});
      this.setState({sleepdates: sleepdate})
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
    console.log("Day1:", day1)
    console.log("Day2:", day2)
    console.log("Day3:", day3)
    console.log("Day4:", day4)
    console.log("Day5:", day5)
    console.log("Day6:", day6)
    console.log("Day7:", day7)
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

    let averages = [this.state.sleepAverage,this.state.waterAverage,this.state.foodAverage]
    let words = ["sleep","water","food"]
    let worst = Math.min(averages[0],averages[1],averages[2])
    let best = Math.max(averages[0],averages[1],averages[2])
    console.log("worst", worst)
    console.log("best", best)
    let lowest = ""
    let highest = ""

    for(let i=0;i<3;i++)
    {
      if(averages[i]== worst)
      {
        lowest = words[i]
      }

      if(averages[i]== best)
      {
        highest = words[i]
      }
      
    }

   // console.log("lowests: ", lowest)
    //console.log("highest: ", highest)

    console.log("water: ", averages[1])
    console.log("Water",this.state.waterData)
    //console.log("sleep: ", averages[0])
    //console.log("food: ", averages[2])

 

    if(lowest == "sleep")
    {
     
      this.setState({feedbackCard: <Card>
        <Card.Title>Sleep Advice</Card.Title>
        <Text style={{marginBottom: 10}}>
              Your sleep time seems to be below average. Why not look for info below from HSE?
            </Text>
          <Card.Image source={require('../images/water.jpg')}>
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
      <Text style={{marginBottom: 10}}>
            Your water intake seems to be below average. Why not look for info below from HSE?
          </Text>
        <Card.Image source={require('../images/water.jpg')}>
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
            Your nutritional intake seems to be below average. Why not look for info below from HSE?
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


  if(highest == "sleep")
  {
   
    this.setState({goodFeedbackCard: <Card>
      <Card.Title>You've Been Sleeping Great!😴</Card.Title>
      <Text style={{marginBottom: 10}}>
            Looks like you've been keeping up on your sleep this week. Keep it up!🛌
          </Text>
        <Card.Image source={require('../images/sleep.jpg')}>
          <Button
              icon={<Icon name='code' color='#ffffff' />}
              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
              title='Click for a Surprise!'
            onPress={ ()=> Linking.openURL('https://www.youtube.com/watch?v=CX45pYvxDiA') }/>
        </Card.Image>
  </Card>}) 
  }
else if(highest == "water")
{
  
  this.setState({goodFeedbackCard: <Card>
    <Card.Title>You're a liquid legend!🌊</Card.Title>
    <Text style={{marginBottom: 10}}>
          Your water consumation is on the up this week! Keep it up 👍
        </Text>
      <Card.Image source={require('../images/water.jpg')}>
        <Button
            icon={<Icon name='code' color='#ffffff' />}
            buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
            title='Click for a Surprise!'
          onPress={ ()=> Linking.openURL('https://www.youtube.com/watch?v=NR5Sr_li7qo') }/>
      </Card.Image>
</Card>} )
}
else if(highest == "food")
{

  this.setState({goodFeedbackCard: <Card>
    <Card.Title>A healthy body is a happy body🥗</Card.Title>
    <Text style={{marginBottom: 10}}>
          Good nutriion can prove vital to a good mood. Keep it up!🔥
        </Text>
      <Card.Image source={require('../images/food.jpg')}>
        <Button
            icon={<Icon name='code' color='#ffffff' />}
            buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
            title='Click for a Surprise!'
          onPress={ ()=> Linking.openURL('https://www.youtube.com/watch?v=VECljlG--gE') }/>
      </Card.Image>
</Card>} )
  
} 


 }

  getCurrentStreak = async() => {
   let averages = [this.state.sleepdates,this.state.waterdates,this.state.fooddates]
  let count = [0,0,0]

 // console.log("Sleep:", averages[0])
 // console.log("Water:", averages[1])
 // console.log("Food:", averages[2])

  for(var i = 0;i<3;i++)
  {

    averages[i].reverse().forEach((el, j) => {
     
      if(i==0)
      {
        console.log(j)
        if ((new Date().setUTCHours(0,0,0,0) - new Date(el*1000).setUTCHours(0,0,0,0)) === j * 86400000) 
        {
        count[i]++
        }
      }
     
     else if(((j+1)%3)==0){
       console.log()
      if ((new Date().setUTCHours(0,0,0,0) - new Date(el*1000).setUTCHours(0,0,0,0)) === ((((j+1)/3)-1) * 86400000) )
        {
        count[i]++
        }
     }


      
      
    })

    
    
  }

  this.setState({sleepstreak: count[0]})
  this.setState({waterstreak: count[1]})
  this.setState({foodstreak: count[2]})


  console.log("************************************************")
  console.log("Sleep Streak: ", count[0])
  console.log("Water Streak: ", count[1])
  console.log("Food Streak: ", count[2])
  console.log("************************************************")


 
} 

    componentDidMount() {
      this.getFoodProgress()
      this.getWaterProgress()
      this.getSleepProgress()
    
      setTimeout(() => {
        this.getAverageFood()
        this.getAverageWater()
        this.getAverageSleep()
        this.getCurrentStreak()
        //console.log("Food Dates: ", this.state.fooddates)
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
        <View style={styles.headerView}>
          <Ionicons
            style={styles.headerItem}
            name="ios-menu"
            size={50}
            md="md-menu"
            onPress={() => this.props.navigation.openDrawer()}
          /></View>
           <ScrollView>
        <View style={styles.infoContainer}>

          <Image source={require("../images/feedback.png")} style={styles.foodImage}></Image>
        </View>

        
        <Text style={styles.Question}>
          {`Your Newest Feedback`}
       </Text>
        
      <View>
       
</View>

       <View style={styles.streakCircles}>

       <View style={styles.individualCircle}>
       <Text STYLE={styles.streakText}>Food Streak</Text>
       <ProgressCircle
            percent={100}
            radius={35}
            borderWidth={8}
            color="#3399FF"
            shadowColor="#999"
            bgColor="#fff"
        >
            <Text style={{ fontSize: 18 }}>{this.state.foodstreak}</Text>
        </ProgressCircle>
        </View>

        <View style={styles.individualCircle}>
        <Text>Water Streak</Text>
       <ProgressCircle
            percent={100}
            radius={35}
            borderWidth={8}
            color="#3399FF"
            shadowColor="#999"
            bgColor="#fff"
        >
            <Text style={{ fontSize: 18 }}>{this.state.waterstreak}</Text>
        </ProgressCircle>
        </View>

        <View style={styles.individualCircle}>
        <Text>Sleep Streak</Text>
       <ProgressCircle
            percent={100}
            radius={35}
            borderWidth={8}
            color="#3399FF"
            shadowColor="#999"
            bgColor="#fff"
        >
            <Text style={{ fontSize: 18 }}>{this.state.sleepstreak}</Text>
        </ProgressCircle>
        </View>

       </View>
       <View>{this.state.feedbackCard}</View>
       <View>{this.state.goodFeedbackCard}</View> 
        
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
  headerView: {
    paddingTop: StatusBar.currentHeight + 10,
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headerItem: {
    flex: 1,
    marginLeft: 30
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
    textAlign:"center",
    marginBottom:20
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
  },
  streakCircles: {
    flexDirection: 'row',
    alignContent: 'flex-end'
  },
  individualCircle:{
    width:'33%',
    marginLeft: 10
  },
  streakText:{
    position : 'absolute',
    bottom : 0,
    top : 50,
    left : 0,
    right : 2,
    alignItems: 'center',
    justifyContent:'center'
  }
});
