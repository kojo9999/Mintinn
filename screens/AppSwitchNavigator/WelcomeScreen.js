import React from "react";
import {
  Text,
  View,
  Image,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground
} from "react-native";
import colors from "../../assets/colors";
import { Ionicons } from "@expo/vector-icons";
import firebase from "firebase/app";
import "firebase/auth";

const image = { uri: "https://imgur.com/yUgNMP8" };
const googleLogo = { uri: "https://seeklogo.net/wp-content/uploads/2015/09/google-favicon-vector-400x400.png"}
const facebookLogo = { uri: "https://pngimg.com/uploads/facebook_logos/facebook_logos_PNG19752.png"}
const appleLogo = { uri: "https://seeklogo.net/wp-content/uploads/2013/07/apple-mac-vector-logo.png"}
 
export default class WelcomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
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

          this.props.navigation.navigate("LoadingScreen");
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
  render() {
    return (
      <ImageBackground source={require("../../images/authBackground.png")} style={styles.image}>
      <View style={styles.Container }>
        
        
        <View style={styles.userContainer}><Image source={require("../../images/logo.png")} style={styles.user}></Image></View>
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
            <ActivityIndicator size="large" color={colors.logoColor} />
          </View>
        ) : null}
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
        <TouchableOpacity style={styles.Button} onPress={this.onSignIn}><Text style={styles.SignInBtnText}>Sign In</Text></TouchableOpacity>
        <Text style={styles.authIconsText}>Sign in with</Text>
        <View
          style={styles.authIcons}
        >
         <Image source={googleLogo} style={styles.icons}></Image>
         <Image source={facebookLogo} style={styles.icons}></Image>
         <Image source={appleLogo} style={styles.icons}></Image>
        </View>
        <Text style={styles.SignUpText}>Don't have an accont? </Text>
        <Text style={styles.SignUpLink}
          onPress={() => this.props.navigation.navigate("LoginScreen")}
          title="Sign Up"
        >Sign Up</Text>
        
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
  user: {
    height: 80,
    width: 80,
  },
  userContainer: {
    backgroundColor: "black",
    borderRadius: 100,
    marginBottom:60,
    padding: 5
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
