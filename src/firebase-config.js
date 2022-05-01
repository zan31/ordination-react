// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNueUy8wu_8-y6_NBfrJT7j5ETJb-UtbE",
  authDomain: "ordination-e6d79.firebaseapp.com",
  projectId: "ordination-e6d79",
  storageBucket: "ordination-e6d79.appspot.com",
  messagingSenderId: "608011276899",
  appId: "1:608011276899:web:6988154af7af232a751e56",
  measurementId: "G-C96PR6H77L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
