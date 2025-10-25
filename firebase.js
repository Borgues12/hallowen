// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA0lP59ntXyWKVGkFO3hlpkMxOF1Bjfmrg",
  authDomain: "hallowen-e8bf8.firebaseapp.com",
  projectId: "hallowen-e8bf8",
  storageBucket: "hallowen-e8bf8.firebasestorage.app",
  messagingSenderId: "437680051121",
  appId: "1:437680051121:web:86cac8c688a66c1db86390",
  measurementId: "G-QTRNKF6SJH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);