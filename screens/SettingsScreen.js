import React, {Component} from "react"
import {View, Text, StyleSheet} from "react-native"

class SettingsScreen extends Component {
    render() {
        return (
            <View style={StyleSheet.container}>
                <Text>SettingsScreen</Text>
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
    }
});