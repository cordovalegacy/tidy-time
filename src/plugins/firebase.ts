import { initializeApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDN3g5hH51caft4UiGnkTb35FjvQvfVTjo",
  authDomain: "tidy-time-63266.firebaseapp.com",
  projectId: "tidy-time-63266",
  storageBucket: "tidy-time-63266.firebasestorage.app",
  messagingSenderId: "638269050101",
  appId: "1:638269050101:web:33beeb5e98107c8a7cc9bc",
};

const app = initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app);
const auth: Auth = getAuth(app);

export { app, db, auth };