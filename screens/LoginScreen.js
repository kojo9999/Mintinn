import React from "react";
import {
  Image,
  Text,
  View,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  SnapshotViewIOS,

} 
from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import colors from "../assets/colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import "firebase/firestore";
import {db} from '../config/config'
const profileCollection = db().collection('profile');

const image = { uri: "https://media.istockphoto.com/photos/yellow-defocused-light-background-for-christmas-picture-id621116812?k=6&m=621116812&s=170667a&w=0&h=2ZIiSOS9ctAsXGxwlAM-LPRkIoGBUFqaCnNlaVUfL14=" };
const googleLogo = { uri: "https://seeklogo.net/wp-content/uploads/2015/09/google-favicon-vector-400x400.png"}
const facebookLogo = { uri: "https://pngimg.com/uploads/facebook_logos/facebook_logos_PNG19752.png"}
const appleLogo = { uri: "https://seeklogo.net/wp-content/uploads/2013/07/apple-mac-vector-logo.png"}

export default class LoginSCreen extends React.Component {
  constructor() {
    super();
    this.state = {
      username: "",
      userId: "",
      email: "",
      password: "",
      isLoading: false,
    };
  }
  
  onSignIn = async () => {
    if (this.state.email && this.state.password) {
      this.setState({ isLoading: true });
      try {
        const responce = await firebase
          .auth()
          .signInWithEmailAndPassword(this.state.email, this.state.password);
        if (responce) {
          this.setState({ isLoading: false });

          this.props.navigation.navigate('LoadingScreen')
        }
      } catch (error) {
        this.setState({ isLoading: false });
        switch (error.code) {
          case "auth/user-not-found":
            alert("A user with that email does not exist. try signing up");
            break;
          case "auth/invalid-email":
            alert("Please enter an email address");
        }
      }
    } else {
      alert("Please enter in an email and password");
    }
  };
  onSignUp = async () => {
    if (this.state.email && this.state.password) {
      this.setState({ isLoading: true });
      try {
        const responce = await firebase
          .auth()
          .createUserWithEmailAndPassword(
            this.state.email,
            this.state.password
          );
        if (responce) {
          this.setState({ isLoading: false });
          this.onSignIn(this.state.email, this.state.password);
            profileCollection.doc(this.HandleGetUserId()).set({
            username: this.state.username,
            });
            profileCollection.doc(this.HandleGetUserId()).collection('water').add({
            createdat: "",
            waterstatus: ""
            });
            profileCollection.doc(this.HandleGetUserId()).collection('sleep').add({
            createdat: "",
            sleepstatus: ""
            });
            profileCollection.doc(this.HandleGetUserId()).collection('food').add({
            createdat: "",
            foodstatus: ""
            });
            profileCollection.doc(this.HandleGetUserId()).collection('feelings').add({
            createdat: "",
            feelingstatus: ""
            });
        }
      } catch (error) {
        this.setState({ isLoading: false });
        if (error.code == "auth/email-already-in-use") {
          alert("Email already Exists. Try another email");
        }
      }
    } else {
      alert("please enter an email and password");
    }
  };

    HandleGetUserId=()=>{
    let userId = firebase.auth().currentUser.uid;
    return userId;
    };

  render() {
    return (
      <ImageBackground source={require("../images/authBackground.png")} style={styles.image}>
      <View
        style={styles.Container}
      >
        <Ionicons style={styles.User} name="ios-contact" size={100} md="md-contact"/>
        {this.state.isLoading ? (
          <View
            styles={[
              StyleSheet.absoluteFill,
              {
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                elevation: 1000,
              },
            ]}
          >
            <ActivityIndicator size="large" color={colors.logoColor}/>
          </View>
        ) : null}
            
          <TextInput
            style={styles.TextInputUsername}
            placeholder="Username"
            placeholderTextColor="black"
            onChangeText={(username) => this.setState({ username })}
          />
          <TextInput
            style={styles.TextInputEmail}
            placeholder="Email"
            placeholderTextColor="black"
            keyboardType="email-address"
            onChangeText={(email) => this.setState({ email })}
          />
          <TextInput
            style={styles.TextInputPassword}
            placeholder="Password"
            placeholderTextColor="black"
            secureTextEntry
            onChangeText={(password) => this.setState({ password })}
          />
          <TouchableOpacity style={styles.Button} onPress={this.onSignUp} title="Signup" ><Text style={styles.SignInBtnText}>Sign Up</Text></TouchableOpacity>
          <Text style={styles.authIconsText}>Sign up with</Text>
        <View
          style={styles.authIcons}
        >
         <Image source={googleLogo} style={styles.icons}></Image>
         <Image source={facebookLogo} style={styles.icons}></Image>
         <Image source={appleLogo} style={styles.icons}></Image>
        </View>
        <Text style={styles.SignUpText}>Already have an account? </Text>
        <Text style={styles.SignUpLink}
          onPress={() => this.props.navigation.navigate("WelcomeScreen")}
          title="Sign In"
        >Sign In</Text>
      </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    backgroundColor: "#FFBC78"
  },
  User: {
    marginBottom: 50
  },
  TextInputUsername: {
    height: 40,
    width: 300,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
  },
  TextInputEmail: {
    height: 40,
    width: 300,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
  },
  TextInputPassword: {
    height: 40,
    width: 300,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginBottom: 100,
    marginLeft: 30,
    marginRight: 30,
  },
  Button: {
    height: 50,
    width: 200,
    borderRadius: 30,
    marginBottom: 5,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center'

  },
  SignInBtnText: {
    color: 'white'
  },
  SignUpText: {
    color: 'black'
  },
  SignUpLink: {
    color: 'blue',
  },
  authIconsText: {
    marginBottom: 5
  },
  authIcons: {
    marginBottom: 50,
    flexDirection: 'row', 
    justifyContent: 'flex-end'
  },
  icons: {
    height: 25,
    width: 25,
    margin: 2
    
  }
  
});
