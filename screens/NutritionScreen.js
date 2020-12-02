import React, { Component } from "react";
import { View, Text, StyleSheet, Button,TouchableOpacity} from "react-native";

class NutritionScreen extends Component {
constructor() {
    super();
    this.state = {
    result: 0,
    numbers: [0.25, 0.5, 0.75, 1, 2]
    }
}

render() {
    return (
    <View style={styles.container}>
        {this.state.numbers.map((number,index) => {
            return(<TouchableOpacity style={styles.button} key={index}><Text style={styles.Text}>{number}</Text></TouchableOpacity>)
        })}
        <Text>You Drank {this.state.result} out of 3.7L Today </Text>
    </View>
    );
}
}
export default NutritionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  button:{
    height:50,
    width:200,
    borderRadius:30,
    marginBottom:10,
    backgroundColor:'blue',
    justifyContent:'center',
    alignItems:'center'
  },
  Text:{
    color:'white'
  },
});
