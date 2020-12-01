import React from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import colors from "../../assets/colors";
import { Ionicons } from "@expo/vector-icons";
import firebase from "firebase/app";
import "firebase/auth";

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
      <View style={styles.Container }>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
         
        </View>
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
        <Text style={styles.SignUpText}>Don't have an accont? </Text>
        <Text style={styles.SignUpLink}
          onPress={() => this.props.navigation.navigate("LoginScreen")}
          title="Sign Up"
        >Sign Up</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  User: {
    marginBottom: 70
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
    marginBottom: 130,
    marginLeft: 30,
    marginRight: 30,
  },
  Button: {
    height: 50,
    width: 200,
    borderRadius: 30,
    marginBottom: 50,
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
    marginBottom: 50
  }
  
});
