import * as firebase from 'firebase/app';
import { firebaseConfig } from '../config';
const provider = new firebase.auth.GoogleAuthProvider();

firebase.initializeApp(firebaseConfig);

export function getAuthState(cb: any) {
  return firebase.auth().onAuthStateChanged(cb);
}

export function createUser(email: string, password: string) {
  return firebase.auth().createUserWithEmailAndPassword(email, password);
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
    .catch(function(error) {
      // An error happened.
    });
}

export function signIn(email: string, password: string) {
  return firebase.auth().signInWithEmailAndPassword(email, password);
}

export function googleSignIn() {
  return firebase.auth().signInWithPopup(provider);
}
