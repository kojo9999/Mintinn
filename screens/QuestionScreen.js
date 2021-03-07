import React, { Component } from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import * as Progress from "react-native-progress";
import "firebase/auth";
import "firebase/firestore";
import firebase from "firebase/app";
import { db } from "../config/config";
import { TouchableOpacity } from "react-native-gesture-handler";
const AnswerCollection = db().collection("profile");
const QuestionCollection = db().collection("questions");
var currentQuestion = -1;

export default class QuestionScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      questions: [],
      answers: [],
      activeQuestion: "",
    };
  }

  getQuestions = async () => {
    let Questiondata = [];
    let userId = this.HandleGetUserId();
    var questionData = this.state.questions;
    QuestionCollection.get().then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        const newQuestionData = {
          Date: doc.data().Date,
          Question: doc.data().Question,
        };
        questionData.push(newQuestionData);
      });
      this.setState({ questions: questionData });
      this.nextQuestion();
      console.log("check for returned Question value", this.state.questions);
    });
  };

  saveAnswers = ([]) => {};

  nextQuestion = () => {
    currentQuestion++;

    if (currentQuestion < 2) {
      this.setState({
        activeQuestion: this.state.questions[currentQuestion].Question,
      });
      console.log(currentQuestion);
      console.log(this.state.questions[currentQuestion].Question);
    } else {
      currentQuestion = 0;
    }
  };

  HandleGetUserId = () => {
    let userId = firebase.auth().currentUser.uid;
    return userId;
  };

  componentDidMount() {
    this.getQuestions();
    console.log("Check Question State after call:", this.state.questions);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Daily Questions</Text>
        <View style={styles.buttonContainer}>
          <Text style={styles.question}>{this.state.activeQuestion}</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => this.nextQuestion()}
          >
            <Text style={styles.text}>Strongly Agree</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.nextQuestion()}
          >
            <Text style={styles.text}>Slightly Agree</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.nextQuestion()}
          >
            <Text style={styles.text}>No Opinion</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.nextQuestion()}
          >
            <Text style={styles.text}>Slightly Disagree</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.nextQuestion()}
          >
            <Text style={styles.text}>Strongly Disagree</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginBottom: 80
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    height: 50,
    width: 200,
    borderRadius: 30,
    marginBottom: 10,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
  },
  title: {
    paddingTop: StatusBar.currentHeight + 30,
    fontSize: 30,
  },
  question: {
    color: "black",
    marginBottom: 70,
    marginHorizontal: 10,
    fontSize: 15,
    justifyContent: "center"
  },
});
