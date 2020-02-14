import * as firebase from 'firebase/app';
import 'firebase/firestore';

const db = firebase.firestore();

export function getProjects(userId: string | undefined, cb: any) {
  return db
    .collection('projects')
    .where('users', 'array-contains', userId)
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

export function addProject({
  name,
  userId
}: {
  name: string;
  userId: string | undefined;
}) {
  return db.collection('projects').add({ name, users: [userId] });
}

export function updateProjectName({
  projectId,
  name
}: {
  projectId: string;
  name: string;
}) {
  return db
    .collection('projects')
    .doc(projectId)
    .update({ name });
}

export function removeProject(projectId: string | undefined) {
  if (projectId) {
    return db
      .collection('projects')
      .doc(projectId)
      .delete();
  }
}

export function getEventsById(id: string, cb: any) {
  return db
    .collection('projects')
    .doc(id)
    .collection('events')
    .orderBy('date')
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
    .collection('projects')
    .doc(projectId)
    .collection('events')
    .add({
      title,
      date,
      completed,
      isDisabled
    });
}

export function updateEvent({
  projectId,
  eventId,
  completed
}: {
  projectId: string;
  eventId: string;
  completed: boolean;
}) {
  return db
    .collection('projects')
    .doc(projectId)
    .collection('events')
    .doc(eventId)
    .update({ completed });
}

export function removeEvent({
  projectId,
  eventId
}: {
  projectId: string;
  eventId: string;
}) {
  return db
    .collection('projects')
    .doc(projectId)
    .collection('events')
    .doc(eventId)
    .delete();
}
