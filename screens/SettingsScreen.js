import React from "react";
import { Component } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import firebase from "firebase/app";
import "firebase/auth";

class SettingsScreen extends Component {
    signOut = async () => {
        try {
            await firebase.auth().signOut();
            this.props.navigation.navigate("WelcomeScreen");
        } catch (errors) {
            alert("unable to sign out right now");
        }
    };
    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.button}
                    onPress={() => this.signOut()}>
                    <Text style={styles.signout}>Sign Out</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
export default SettingsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        height: 50,
        width: 200,
        borderRadius: 30,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
    },
    signout: {
        color: "white",
    },
});