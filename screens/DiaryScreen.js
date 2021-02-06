import React, {Component, useState} from "react"
import {View, Text, StyleSheet, Button} from "react-native"
import "firebase/auth"
import "firebase/firestore"
import firebase from "firebase/app"
import {db} from '../config/config'
const diaryCollection = db().collection('profile');

class DiaryScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            food: [[]],
            water: [],
            sleep: []
        }
    }

    HandleGetUserId = () => {
        let userId = firebase.auth().currentUser.uid;
        return userId;
    }

    retrieveDiaryData = async () => {
        let userId = this.HandleGetUserId();
        diaryCollection.doc(userId).collection('food')
        .get().then((snapshot) => {
            let diaryData = [];
            snapshot.docs.forEach((doc) => {
                /*const newFoodDoc = {
                    createdat: new Date(doc.data().createdat.toDate()).toDateString(),
                    foodstatus: doc.data().foodstatus,
                    foodamount: doc.data().foodamount,
                    timeOfDay: doc.data().timeOfDay,
                    updatedat: doc.data().updatedAt
                }*/
                let newFoodDoc = doc.data();
                diaryData.push(newFoodDoc);
                this.state.food.push(newFoodDoc);
                console.log('diaryData array',diaryData);
                //console.log('this.state.food array', this.state.food);
            })
        })
        console.log('end of retrieveDiaryData() diaryData array: ', diaryData)
        console.log('end of retrieveDiaryData() this.state.food array: ', diaryData)
        return diaryData;
    }
    
    render() {
        const data = this.retrieveDiaryData();
        console.log('console log call inside render() for data :',data)
        console.log('console log call inside render() for this.state.food', this.state.food)

        return (
            <View style={styles.container}>
                <Text>Diary Screen</Text>
                <Button title={"Diary Test"} onPress={() => this.retrieveDiaryData()}></Button>
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