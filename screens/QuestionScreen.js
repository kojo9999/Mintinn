import React, { Component } from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import { Snackbar } from "react-native-paper";
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
      answersNum: [5, 4, 3, 2, 1],     
      activeQuestion: "",
      outputText: "",
      questionNumber: 1
    };
  }

  handleSnackbar = () => {
    this.setState({ snackbarShow: true });
    setTimeout(() => {
      this.setState({ snackbarShow: false });
    }, 1000);
  };

  onDismissSnackBar = () => {
    this.setState({ snackbarShow: false });
  };

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
    this.handleSnackbar();
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
      this.setState({ outputText: "Your answer to question " + this.state.questionNumber + " has been uploaded" })
      if(this.state.questionNumber!=5){
        this.setState({ questionNumber: this.state.questionNumber+1 })
        }
    this.nextQuestion();
  };

  nextQuestion = () => {
    if (currentQuestion < 4) {
      currentQuestion++;
      this.setState({
        activeQuestion: this.state.questions[currentQuestion].Question,
      });
      console.log(currentQuestion);
      console.log(this.state.questions[currentQuestion].Question);
    }
    else
    {
      this.setState({
        activeQuestion: "Check Back Tomorrow For More",
      })
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
        
        </View>
        <Text style={styles.headerTitle}>Daily Questions</Text>
        <View style={styles.buttonContainer}>
          <Text style={styles.question}>{this.state.activeQuestion}</Text>
          <Text style={styles.questionCount}>{this.state.questionNumber + "/5"}</Text>

          <TouchableOpacity
            style={styles.button1}
            onPress={() => this.addQuestionsAndAnswers(this.state.answersNum[0], this.state.activeQuestion)}
          >
            <Text style={styles.text}>Strongly Agree</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button2}
            onPress={() => this.addQuestionsAndAnswers(this.state.answersNum[1], this.state.activeQuestion)}
          >
            <Text style={styles.text}>Slightly Agree</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button3}
            onPress={() => this.addQuestionsAndAnswers(this.state.answersNum[2], this.state.activeQuestion)}
          >
            <Text style={styles.text}>No Opinion</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button4}
            onPress={() => this.addQuestionsAndAnswers(this.state.answersNum[3], this.state.activeQuestion)}
          >
            <Text style={styles.text}>Slightly Disagree</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button5}
            onPress={() => this.addQuestionsAndAnswers(this.state.answersNum[4], this.state.activeQuestion)}
          >
            <Text style={styles.text}>Strongly Disagree</Text>
          </TouchableOpacity>
        </View>
        <Snackbar
          visible={this.state.snackbarShow}
          onDismiss={this.onDismissSnackBar}
          action={{
            label: "OK",
            onPress: () => {
              this.setState({ snackbarShow: false });
            },
          }}
        >
          {this.state.outputText}
        </Snackbar>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  headerView: {
    paddingTop: StatusBar.currentHeight + 10,
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  
  },
  headerItem: {
    width: "100%",
    paddingLeft: 25,
    marginTop: 0
  },
  headerTitle: {
    fontSize: 24,
    marginLeft: 50,
    marginRight: 50,
    marginTop: 40
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 20,
    marginRight: 20
  },
  button1: {
    height: 50,
    width: 200,
    borderRadius: 30,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#61c75f",
    justifyContent: "center",
    alignItems: "center",
  },
  button2: {
    height: 50,
    width: 200,
    borderRadius: 30,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#5fabc7",
    justifyContent: "center",
    alignItems: "center",
  },
  button3: {
    height: 50,
    width: 200,
    borderRadius: 30,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#855fc7",
    justifyContent: "center",
    alignItems: "center",
  },
  button4: {
    height: 50,
    width: 200,
    borderRadius: 30,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#c75faf",
    justifyContent: "center",
    alignItems: "center",
  },
  button5: {
    height: 50,
    width: 200,
    borderRadius: 30,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#c75f64",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "black",
  },
  title: {
    paddingTop: StatusBar.currentHeight + 30,
    fontSize: 30,
  },
  question: {
    color: "black",
    marginBottom: 30,
    marginHorizontal: 10,
    fontSize: 15,
    justifyContent: "center",
    alignItems: 'center',
    textAlign: 'center'
  },
  questionCount: {
    color: "black",
    fontSize: 15,
    justifyContent: "center",
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 40,
  }
});
