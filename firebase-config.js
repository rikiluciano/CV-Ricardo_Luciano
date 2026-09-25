import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, updatePassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  projectId: "cv-ricardo-pro",
  appId: "1:987128880933:web:bbadc99e833642fc9784cc",
  storageBucket: "cv-ricardo-pro.firebasestorage.app",
  apiKey: "AIzaSyB7nkA6udC0DPQ0dCdWiNpR5ayuFf5oPVs",
  authDomain: "cv-ricardo-pro.firebaseapp.com",
  messagingSenderId: "987128880933"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage, ref, uploadBytes, getDownloadURL, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, doc, getDoc, setDoc, signInWithEmailAndPassword, createUserWithEmailAndPassword, updatePassword, updateProfile };
