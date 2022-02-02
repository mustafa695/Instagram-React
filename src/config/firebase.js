import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/storage"
const firebaseConfig = {
  apiKey: "AIzaSyAMMmoYMZSLfeOUqkyriC5lI7OxnfdRSFI",
  authDomain: "instagram-563fe.firebaseapp.com",
  projectId: "instagram-563fe",
  storageBucket: "instagram-563fe.appspot.com",
  messagingSenderId: "33684774093",
  appId: "1:33684774093:web:c0803a847286526c9c5d84",
  measurementId: "G-4Y01K0W2SL",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

export { firebase, db, auth, storage };
