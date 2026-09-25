import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  projectId: "cv-editor-ricardo",
  appId: "1:949453348236:web:773ba178a483f58edf8aa9",
  storageBucket: "cv-editor-ricardo.firebasestorage.app",
  apiKey: "AIzaSyBXaRx5UyUVjMqBrCWEAG8VihySDEZqGoo",
  authDomain: "cv-editor-ricardo.firebaseapp.com",
  messagingSenderId: "949453348236"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, doc, getDoc, setDoc };
