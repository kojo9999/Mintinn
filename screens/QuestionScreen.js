import React, { Component } from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import * as Progress from "react-native-progress";
import "firebase/auth";
import "firebase/firestore";
import firebase from "firebase/app";
import { db } from "../config/config";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from '@expo/vector-icons'
const AnswerCollection = db().collection("profile");
const QuestionCollection = db().collection("questions");
var currentQuestion = -1;

export default class QuestionScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      questions: [],
      answers: ["Strongly Agree", "Slightly Agree", "No Opinion", "Slightly Disagree", "Strongly Disagree"],
      activeQuestion: "",
      outputText: "",
      questionNumber: 1
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

  addQuestionsAndAnswers = (answer, question) => {
    let userId = this.HandleGetUserId();
    let batch = firebase.firestore().batch();
    const today = new Date();
    AnswerCollection.doc(userId).collection('questions')
      .where("createdat", ">", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0))
      .where("createdat", "<", new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59))
      .get().then(function (querySnapshot) {
        console.log(querySnapshot.size)
        if (querySnapshot.size == 0) {
          AnswerCollection.doc(userId).collection('questions').add({
            createdAt: new Date(),
            question: question,
            answer: answer
          })
        }
      })
      this.setState({ outputText: "Your answer to question" + this.state.questionNumber + " has been uploaded" })
      this.setState({ questionNumber: this.state.questionNumber+1 })
    this.nextQuestion();
  };

  nextQuestion = () => {
    currentQuestion++;

    if (currentQuestion < 2) {
      this.setState({
        activeQuestion: this.state.questions[currentQuestion].Question,
      });
      console.log(currentQuestion);
      console.log(this.state.questions[currentQuestion].Question);
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
      <View style={styles.headerView}>
          <Ionicons
            style={styles.headerItem}
            name="ios-menu"
            size={50}
            md="md-menu"
            onPress={() => this.props.navigation.openDrawer()}
          />
        <Text style={styles.headerTitle}>Daily Questions</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Text style={styles.question}>{this.state.activeQuestion}</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => this.addQuestionsAndAnswers(this.state.answers[0], this.state.activeQuestion)}
          >
            <Text style={styles.text}>{this.state.answers[0]}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => this.addQuestionsAndAnswers(this.state.answers[1], this.state.activeQuestion)}
          >
            <Text style={styles.text}>{this.state.answers[1]}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.addQuestionsAndAnswers(this.state.answers[2], this.state.activeQuestion)}
          >
            <Text style={styles.text}>{this.state.answers[2]}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => this.addQuestionsAndAnswers(this.state.answers[3], this.state.activeQuestion)}
          >
            <Text style={styles.text}>{this.state.answers[3]}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => this.addQuestionsAndAnswers(this.state.answers[4], this.state.activeQuestion)}
          >
            <Text style={styles.text}>{this.state.answers[4]}</Text>
          </TouchableOpacity>
        </View>
        <Text>{this.state.outputText}</Text>
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
  headerView: {
    paddingTop: StatusBar.currentHeight + 10,
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headerItem: {
    flex: 1,
    textAlign: "center",
  },
  headerTitle: {
    fontSize: 24,
    marginLeft: 50,
    marginRight: 50,
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
