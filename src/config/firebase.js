import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBomyGWzbe8YUsGrCyqAnbPWGkCy3B9Id8",
  authDomain: "cave-chat.firebaseapp.com",
  projectId: "cave-chat",
  storageBucket: "cave-chat.appspot.com",
  messagingSenderId: "283220585534",
  appId: "1:283220585534:web:c9ea99d8a75af51fdd756f",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
