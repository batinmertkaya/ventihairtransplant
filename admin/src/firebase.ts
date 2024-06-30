// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-gcQykUEvaDqiC5CJaqDEzuKOqn8fM24",
  authDomain: "heva-mert.firebaseapp.com",
  projectId: "heva-mert",
  storageBucket: "heva-mert.appspot.com",
  messagingSenderId: "574611258734",
  appId: "1:574611258734:web:256849698958af72fdd57f",
  measurementId: "G-8851D5KKZ5",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
