import React from "react";
import {
  Button,
  Text,
  View,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../assets/colors";
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
      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="ios-bookmarks" size={150} color={colors.logoColor} />
          <Text style={{ fontSize: 50, fontWeight: "100" }}>M'Intinn</Text>
        </View>
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
        <Button
          onPress={() => this.props.navigation.navigate("LoginScreen")}
          title="Sign Up"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
