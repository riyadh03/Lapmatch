// src/services/authService.js
import { auth } from "./firebase";  // ou firebaseConfig.js selon nom
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// LOGIN
export const loginUser = async (email, password) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res;
  } catch (error) {
    console.error('authService.loginUser error', error.code || error.message || error);
    throw error;
  }
};

// SIGNUP
export const signupUser = async (email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    return res;
  } catch (error) {
    console.error('authService.signupUser error', error.code || error.message || error);
    throw error;
  }
};

// LOGOUT
export const logoutUser = async () => {
  return await signOut(auth);
};
