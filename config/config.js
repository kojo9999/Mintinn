import * as firebase from 'firebase'
import 'firebase/firestore'

// export const firebaseConfig = {
//     apiKey: "AIzaSyAv4vy7lCDsZLfFY6EB1ndieWqYHUnIUCM",
//     authDomain: "tutorial-a0e39.firebaseapp.com",
//     databaseURL: "https://tutorial-a0e39.firebaseio.com",
//     projectId: "tutorial-a0e39",
//     storageBucket: "tutorial-a0e39.appspot.com",
//     messagingSenderId: "1036015377066",
//     appId: "1:1036015377066:web:755a12627d77a499ff0ed3",
//     measurementId: "G-RG5M72KFP3"
// };

firebase.initializeApp({
    apiKey: "AIzaSyAv4vy7lCDsZLfFY6EB1ndieWqYHUnIUCM",
    authDomain: "tutorial-a0e39.firebaseapp.com",
    databaseURL: "https://tutorial-a0e39.firebaseio.com",
    projectId: "tutorial-a0e39",
    storageBucket: "tutorial-a0e39.appspot.com",
    messagingSenderId: "1036015377066",
    appId: "1:1036015377066:web:755a12627d77a499ff0ed3",
    measurementId: "G-RG5M72KFP3"
});

export default firebase
export const db = firebase.firestore
