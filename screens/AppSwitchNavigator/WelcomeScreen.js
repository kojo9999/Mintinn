import React from "react";
import { Button, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../assets/colors";

export default class WelcomeScreen extends React.Component {
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
          <Text style={{ fontSize: 50, fontWeight: "100" }}>Book worm</Text>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Button
            style={{}}
            title="Login"
            onPress={() => this.props.navigation.navigate('LoginScreen')}
          />
        </View>
      </View>
    );
  }
}
