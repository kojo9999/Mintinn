import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import WelcomeScreen from './screens/AppSwitchNavigator/WelcomeScreen'
import HomeScreen from './screens/HomeScreen'
import LoginScreen from './screens/LoginScreen'
import LoadingScreen from './screens/LoadingScreen'
import InfoScreen from './screens/InfoScreen'
import SettingsScreen from './screens/SettingsScreen'
import CalendarScreen from './screens/CalendarScreen'
import NutritionScreen from './screens/NutritionScreen'
import WaterScreen from './screens/WaterScreen'
import SleepScreen from './screens/SleepScreen'
import QuestionScreen from './screens/QuestionScreen'
import FeedbackScreen from './screens/FeedbackScreen'
import firebase from 'firebase/app'
import {firebaseConfig} from './config/config'
import {createDrawerNavigator} from 'react-navigation-drawer'
import {Ionicons, MaterialCommunityIcons, FontAwesome, Entypo} from '@expo/vector-icons'

class App extends React.Component{
    constructor(){
        super();
    //     this.initializeFirebase();
     }
    // initializeFirebase = () => {
    //     !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : null  
    // };
    render(){
    return <AppContainer/>;
}
}

const AppDrawerNavigator = createDrawerNavigator({
    HomeScreen:{
        screen: HomeScreen,
        navigationOptions: {
            title:'Home',
            drawerIcon:() => <Ionicons name="ios-home" size={24} />
        }
    },
    CalendarScreen:{
        screen: CalendarScreen,
        navigationOptions: {
            title:'statistics',
            drawerIcon:() => <FontAwesome name="line-chart" size={24} />
        }
    },
    NutritionScreen:{
        screen: NutritionScreen,
        navigationOptions: {
            title:'Food',
            drawerIcon:() => <MaterialCommunityIcons name="food-apple" size={24} />
        }
    },
    WaterScreen:{
        screen: WaterScreen,
        navigationOptions: {
            title:'Water',
            drawerIcon:() => <MaterialCommunityIcons name="water" size={24} />
        }
    },
    SleepScreen:{
        screen: SleepScreen,
        navigationOptions: {
            title:'Sleep',
            drawerIcon:() => <MaterialCommunityIcons name="sleep" size={24} />
        }
    },
    QuestionScreen:{
        screen: QuestionScreen,
        navigationOptions: {
            title:'Questions',
            drawerIcon:() => <MaterialCommunityIcons name="account-question" size={24} />
        }
    },
    FeedbackScreen:{
        screen: FeedbackScreen,
        navigationOptions: {
            title:'Feedback',
            drawerIcon:() => <Entypo name="swap" size={24} />
        }
    },
    InfoScreen:{
        screen: InfoScreen,
        navigationOptions: {
            title:'Info',
            drawerIcon:() => <FontAwesome name="info" size={24} />
        }
    },
    SettingsScreen: {
        screen: SettingsScreen,
        navigationOptions: {
            title: 'Log Out',
            drawerIcon:() => <MaterialCommunityIcons name="logout" size={24} />
        }
    }
})

const LoginStackNavigator = createSwitchNavigator({
    WelcomeScreen,
    LoginScreen,
    LoadingScreen,
    CalendarScreen,
    SleepScreen,
    WaterScreen,
    NutritionScreen,
    QuestionScreen,
    FeedbackScreen
});

const AppSwitchNavigator = createSwitchNavigator({
    LoginStackNavigator,
    AppDrawerNavigator
});


const AppContainer = createAppContainer(AppSwitchNavigator)

export default App;