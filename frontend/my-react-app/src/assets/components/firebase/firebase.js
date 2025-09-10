// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAgAtWjTI0-2H6dwKRq-quyOG9dNAlistY",
  authDomain: "probmap-ff0a5.firebaseapp.com",
  projectId: "probmap-ff0a5",
  storageBucket: "probmap-ff0a5.firebasestorage.app",
  messagingSenderId: "209031081482",
  appId: "1:209031081482:web:a77f8a1c055b77834bb9f3",
  measurementId: "G-7BBEDC131M"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

console.log("Firebase initialized:", app.name);
console.log("Auth object:", auth);

export { app, auth };