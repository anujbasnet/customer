import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDtrmiAuVPDhmRZoNgYbK58-aDH4d057Sk",
  authDomain: "customer-login-7d486.firebaseapp.com",
  projectId: "customer-login-7d486",
  storageBucket: "customer-login-7d486.firebasestorage.app",
  messagingSenderId: "600255442813",
  appId: "1:600255442813:web:440592ac45989c90dfe614"
};

// Initialize Firebase app
export const app = initializeApp(firebaseConfig);

// Initialize Auth (Web SDK works on iOS, Android, Web)
export const auth = getAuth(app);
export const db = getFirestore(app);
