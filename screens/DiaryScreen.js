import React, {Component} from "react"
import {View, Text, StyleSheet} from "react-native"

class DiaryScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Diary Screen</Text>
            </View>
        );
    }
}
export default DiaryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});