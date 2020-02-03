import * as firebase from "firebase/app";
import "firebase/auth";
import { firebaseConfig } from "../config";

firebase.initializeApp(firebaseConfig);

export function getAuthState(cb: any) {
  return firebase.auth().onAuthStateChanged(cb);
}

export function createUser(
  email: string,
  password: string,
  errorHandler: any = () => {}
) {
  return firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .catch(errorHandler);
}

export function resetPassword(email: string) {
  return firebase.auth().sendPasswordResetEmail(email);
}

export function getCurrentUser() {
  return firebase.auth().currentUser;
}

export function signOut() {
  return firebase
    .auth()
    .signOut()
    .then(function() {
      alert("signed out");
    })
    .catch(function(error) {
      // An error happened.
    });
}

export function signIn(
  email: string,
  password: string,
  errorHandler: any = () => {}
) {
  return firebase.auth().signInWithEmailAndPassword(email, password);
}
