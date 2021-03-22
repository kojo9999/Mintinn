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
import { CheckBox } from 'react-native-elements'
import firebase from "firebase/app";
import "firebase/auth";
import colors from "../assets/colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import "firebase/firestore";
import { db } from '../config/config'
const profileCollection = db().collection('profile');

const googleLogo = { uri: "https://seeklogo.net/wp-content/uploads/2015/09/google-favicon-vector-400x400.png" }
const facebookLogo = { uri: "https://pngimg.com/uploads/facebook_logos/facebook_logos_PNG19752.png" }
const appleLogo = { uri: "https://seeklogo.net/wp-content/uploads/2013/07/apple-mac-vector-logo.png" }

export default class LoginSCreen extends React.Component {
  constructor() {
    super();
    this.state = {
      username: "",
      usernameError: "",
      userId: "",
      email: "",
      emailError: "",
      password: "",
      passwordError: "",
      confirmPassword: "",
      confirmPasswordError: "",
      error: '',
      isLoading: false,
      checked: false,
      checkedError: "",
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
    if (this.TermsAndConditions() == false) {
      this.setState({ error: "Please try again" })
    }
    else if (this.usernameValidator() == false) {
      this.setState({ error: "Please try again" })
    }
    else if (this.EmailValidator() == false) {
      this.setState({ error: "Please try again" })
    }
    else if (this.passwordValidator() == false) {
      this.setState({ error: "Please try again" })
    }
    else if (this.confirmPasswordValidator() == false) {
      this.setState({ error: "Please try again" })
    }
    else {
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
            profileCollection.doc(this.HandleGetUserId()).collection('questions').add({
              createdat: "",
              feelingstatus: ""
            });
          }
        } catch (error) {
          this.setState({ isLoading: false });
          if (error.code == "auth/email-already-in-use") {
            this.setState({ error: "Email already Exists. Try another email" });
          }
        }
      } else {
        this.setState({ error: "please enter an Email and Password" });
      }
    }
  };

  HandleGetUserId = () => {
    let userId = firebase.auth().currentUser.uid;
    return userId;
  };

  usernameValidator = () => {
    if (this.state.username == "") {
      this.setState({ usernameError: "Username field cannot be left empty" })
      return false;
    }
    else if (this.state.username.length < 5) {
      this.setState({ usernameError: "Your username must have 5 characters or more" })
      return false;
    }
    else {
      this.setState({ usernameError: "" })
      return true;
    }
  };

  EmailValidator = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(this.state.email) == false) {
      this.setState({ emailError: "This is not a valid email" })
      return false;
    }
    else {
      this.setState({ emailError: "" })
      return true;
    }
  };

  passwordValidator = () => {
    let strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    if (strongRegex.test(this.state.password) == false) {
      this.setState({ passwordError: "The password requires special character (@,#), Capital letter, Numbers and min Length 8 " })
      return false;
    }
    else {
      this.setState({ passwordError: "" })
      return true;
    }
  };

  confirmPasswordValidator = () => {
    if (this.state.password !== this.state.confirmPassword) {
      this.setState({ confirmPasswordError: "Confirm Password and Password do not match" })
      return false;
    }
    else {
      this.setState({ confirmPasswordError: "" })
      return true;
    }
  };

  TermsAndConditions = () => {
    if (this.state.checked == false) {
      this.setState({ checkedError: "Please confirm that you have read the terms and conditions" })
      return false;
    }
    else {
      this.setState({ confirmPasswordError: "" })
      return true;
    }
  }


  render() {
    return (
      <ImageBackground source={require("../images/authBackground.png")} style={styles.image}>
        <View
          style={styles.Container}
        >
          <View style={styles.userContainer}><Image source={require("../images/logo.png")} style={styles.user}></Image></View>
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
            style={styles.TextInputUsername}
            placeholder="Username"
            placeholderTextColor="black"
            onBlur={() => this.usernameValidator()}
            minLength={4}
            onChangeText={(username) => this.setState({ username })}
          />
          <Text style={styles.error}>{this.state.usernameError}</Text>

          <TextInput
            style={styles.TextInputEmail}
            placeholder="Email"
            placeholderTextColor="black"
            onBlur={() => this.EmailValidator()}
            keyboardType="email-address"
            onChangeText={(email) => this.setState({ email })}
          />
          <Text style={styles.error}>{this.state.emailError}</Text>

          <TextInput
            style={styles.TextInputPassword}
            placeholder="Password"
            placeholderTextColor="black"
            onBlur={() => this.passwordValidator()}
            secureTextEntry
            onChangeText={(password) => this.setState({ password })}
          />
          <Text style={styles.error}>{this.state.passwordError}</Text>

          <TextInput
            style={styles.TextInputCPassword}
            placeholder="Confirm Password"
            placeholderTextColor="black"
            onBlur={() => this.confirmPasswordValidator()}
            secureTextEntry
            onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
          />
          <Text style={styles.error}>{this.state.confirmPasswordError}</Text>
          <Text style={styles.authIconsText}>By clicking this button you are agreeing that you have read the tearms and conditions</Text>
          <CheckBox
            center
            iconRight
            checkedIcon='dot-circle-o'
            uncheckedIcon='circle-o'
            checked={this.state.checked}
            onPress={() => this.setState({ checked: !this.state.checked })}
          />
          <Text style={styles.error}>{this.state.checkedError}</Text>

          <Text style={styles.error}>{this.state.error}</Text>
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
  user: {
    height: 80,
    width: 80,
  },
  userContainer: {
    backgroundColor: "black",
    borderRadius: 100,
    marginBottom: 60,
    padding: 5
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
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
  },
  TextInputCPassword: {
    height: 40,
    width: 300,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginBottom: 50,
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
  },
  error: {
    color: 'red',
  }
});