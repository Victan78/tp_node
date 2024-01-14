import firebase from 'firebase/app';
import 'firebase/auth';        // for authentication
import 'firebase/storage';     // for storage
import 'firebase/database';    // for realtime database
import 'firebase/firestore';   // for cloud firestore
import 'firebase/messaging';   // for cloud messaging


const firebaseConfig = {
    apiKey: "AIzaSyD7bJOLXaUothCAR7tY8Rd8QY5jeLEVorI",
    authDomain: "gensheet-b606a.firebaseapp.com",
    projectId: "gensheet-b606a",
    storageBucket: "gensheet-b606a.appspot.com",
    messagingSenderId: "989717316534",
    appId: "1:989717316534:web:085ee2f24b25291c70b717",
    measurementId: "G-W5JVGT1W92"
  };
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();

// Fournisseurs d'authentification
const googleProvider = new firebase.auth.GoogleAuthProvider();
const facebookProvider = new firebase.auth.FacebookAuthProvider();
const twitterProvider = new firebase.auth.TwitterAuthProvider();

export { auth, googleProvider, facebookProvider, twitterProvider };
export default db;