// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbMjrRYjy8SYgmFlR_06AbPgeFUZEztUo",
  authDomain: "inventory-management-47500.firebaseapp.com",
  projectId: "inventory-management-47500",
  storageBucket: "inventory-management-47500.appspot.com",
  messagingSenderId: "1091679295644",
  appId: "1:1091679295644:web:8332aa537ffe2446fbb559",
  measurementId: "G-M50S42HK4Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore};