import React, {Component} from "react"
import {View, Text, StyleSheet} from "react-native"

class NutritionScreen extends Component {
    render() {
        return (
            <View style={StyleSheet.container}>
                <Text>NutritionScreen</Text>
            </View>
        );
    }
}
export default NutritionScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});