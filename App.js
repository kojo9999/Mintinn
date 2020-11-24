import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import WelcomeScreen from './screens/AppSwitchNavigator/WelcomeScreen'
import HomeScreen from './screens/HomeScreen'
import LoginScreen from './screens/LoginScreen'
import LoadingScreen from './screens/LoadingScreen'
import firebase from 'firebase/app'
import {firebaseConfig} from './config/config'

class App extends React.Component{
    constructor(){
        super();
        this.initializeFirebase();
    }
    initializeFirebase = () => {
        firebase.initializeApp(firebaseConfig);
    };
    render(){
    return <AppContainer/>;
}
}

const LoginStackNavigator = createSwitchNavigator({
    WelcomeScreen,
    LoginScreen,
    LoadingScreen
});

const AppSwitchNavigator = createSwitchNavigator({
    LoginStackNavigator,
    HomeScreen
});


const AppContainer = createAppContainer(AppSwitchNavigator)

export default App;