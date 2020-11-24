import React from "react";
import {
  Button,
  Text,
  View,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import colors from "../assets/colors";

export default class LoginSCreen extends React.Component {
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
  render() {
    return (
      <View
        style={{
          flex: 1,
          borderWidth: 1,
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
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
        <View>
          <TextInput
            styles={styles.TextInput}
            placeholder="abc@gmail.com"
            placeholderTextColor="black"
            keyboardType="email-address"
            onChangeText={(email) => this.setState({ email })}
          />
          <TextInput
            styles={styles.TextInput}
            placeholder="enter password"
            placeholderTextColor="black"
            secureTextEntry
            onChangeText={(password) => this.setState({ password })}
          />
          <Button style={{}} onPress={this.onSignIn} title="Login" />
          <Button style={{}} onPress={this.onSignUp} title="Signup" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
