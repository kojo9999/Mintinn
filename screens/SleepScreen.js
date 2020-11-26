import React, {Component} from "react"
import {View, Text, StyleSheet} from "react-native"

class SleepScreen extends Component {
    render() {
        return (
            <View style={StyleSheet.container}>
                <Text>SleepScreen</Text>
            </View>
        );
    }
}
export default SleepScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});