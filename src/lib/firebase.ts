// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
import { browser } from "$app/environment";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAffaYyVrym6SNFJd11FJ-ZUFaapHH2e4o",
  authDomain: "cursor-todo-c3425.firebaseapp.com",
  projectId: "cursor-todo-c3425",
  storageBucket: "cursor-todo-c3425.firebasestorage.app",
  messagingSenderId: "518775408061",
  appId: "1:518775408061:web:274de13da75461e43fbed4",
  measurementId: "G-H828FZ9XJH"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);


// Initialize Firebase (Checks if already initialized)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);

// Analytics only runs in the browser, not on the server
export const initAnalytics = async () => {
  if (browser && await isSupported()) {
    return getAnalytics(app);
  }
};
