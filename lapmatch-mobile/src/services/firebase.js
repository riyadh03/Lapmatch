// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDB6-_cLGkAc_g181_VE-sF6FivEFc5ZZs",
  authDomain: "lapmatch-8184c.firebaseapp.com",
  projectId: "lapmatch-8184c",
  storageBucket: "lapmatch-8184c.appspot.com",
  messagingSenderId: "662556542280",
  appId: "1:662556542280:web:5641a44f2b5f2d2f895f7d"
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Note: using RN persistence for Auth. Remove debug logs in production.
