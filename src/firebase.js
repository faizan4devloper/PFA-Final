// import { initializeApp } from "firebase/app";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDb7mp3GoMfhfEgOVTNAZ3bTrzIMgY25UU",
  authDomain: "pfa-trial-d718d.firebaseapp.com",
  projectId: "pfa-trial-d718d",
  storageBucket: "pfa-trial-d718d.appspot.com",
  messagingSenderId: "696410966568",
  appId: "1:696410966568:web:da900b0383c9e77f80831d",
};
firebase.initializeApp(firebaseConfig);
export default firebase;
