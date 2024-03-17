import { auth } from "../config/firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";

export const firebaseCreateUser = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  return { userData: userCredential.user };
};
export const firebaseLoginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return { userData: userCredential.user };
};
export const firebaseLogoutUser = async () => {
  await signOut(auth);
  return { success: true };
};
export const firebaseResetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
  return { success: true };
};
