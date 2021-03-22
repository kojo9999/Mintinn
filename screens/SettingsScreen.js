import React from "react";
import { Component } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    StatusBar
} from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

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
                <Ionicons
                    style={styles.headerItem}
                    name="ios-menu"
                    size={50}
                    md="md-menu"
                    onPress={() => this.props.navigation.openDrawer()}
                />
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
    headerItem: {
        flex: 1,
        textAlign: "center",
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