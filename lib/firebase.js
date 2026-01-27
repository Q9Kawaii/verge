// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCg76S107nj6wyjIOghAj859W1qr_zfUQo",
  authDomain: "verge-7d324.firebaseapp.com",
  projectId: "verge-7d324",
  storageBucket: "verge-7d324.firebasestorage.app",
  messagingSenderId: "582254917287",
  appId: "1:582254917287:web:15aed192542455e8304d82",
  measurementId: "G-3P065YCSFG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);