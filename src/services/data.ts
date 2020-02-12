import * as firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore();

export function getProjects(userId: string | undefined, cb: any) {
  return db
    .collection("projects")
    .where("users", "array-contains", userId)
    .onSnapshot(snapshot => {
      const data = snapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        };
      });
      cb(data);
    });
}

export function addProject({ name, userId }: { name: string; userId: string | undefined }) {
  return db.collection("projects").add({ name, users: [userId] });
}

export function updateProjectName({
  projectId,
  name
}: {
  projectId: string;
  name: string;
}) {
  return db
    .collection("projects")
    .doc(projectId)
    .set({ name });
}

export function getEventsById(id: string, cb: any) {
  return db
    .collection("projects")
    .doc(id)
    .collection("events")
    .onSnapshot(snapshot => {
      const data = snapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        };
      });
      cb(data);
    });
}

export function addEvent({
  projectId,
  title,
  date,
  completed,
  isDisabled
}: {
  projectId: string;
  title: string;
  date: Date;
  completed: boolean;
  isDisabled: boolean;
}) {
  return db
    .collection("projects")
    .doc(projectId)
    .collection("events")
    .add({
      title,
      date,
      completed,
      isDisabled
    });
}
