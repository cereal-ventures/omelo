import * as firebase from 'firebase/app';
import 'firebase/firestore';

const db = firebase.firestore();

export type UserEmail = string | null | undefined;
export type ProjectId = string | null | undefined;

export function getProjectById(projectId: string, cb: any) {
  return db
    .collection('projects')
    .doc(projectId)
    .onSnapshot(snapshot => {
      const data = {
        id: snapshot.id,
        ...snapshot.data()
      };
      cb(data);
    });
}

export function getProjects(userEmail: UserEmail, cb: any) {
  return db
    .collection('projects')
    .where('users', 'array-contains', userEmail)
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
  userEmail
}: {
  name: string;
  userEmail: UserEmail;
}) {
  return db.collection('projects').add({ name, users: [userEmail] });
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
  payload
}: {
  projectId: string;
  eventId: string;
  payload: { [x: string]: any };
}) {
  return db
    .collection('projects')
    .doc(projectId)
    .collection('events')
    .doc(eventId)
    .update(payload);
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

type Asset = 'link'; // | 'video' | 'image' | 'pdf';

export function addAsset({
  projectId,
  eventId,
  name,
  type,
  url
}: {
  projectId: string;
  eventId: string;
  name: string;
  type: Asset;
  url: string;
}) {
  return db.collection('assets').add({
    projectId,
    eventId,
    name,
    type,
    url
  });
}

export function updateAsset({
  assetId,
  name,
  url
}: {
  assetId: string;
  name: string;
  url: string;
}) {
  return db
    .collection('assets')
    .doc(assetId)
    .update({
      name,
      url
    });
}

export function removeAsset(assetId: string) {
  return db
    .collection('assets')
    .doc(assetId)
    .delete();
}

export function getAssetsByEvent(eventId: string, cb: any) {
  return db
    .collection('assets')
    .where('eventId', '==', eventId)
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

export function getAssetsByProject(projectId: string, cb: any) {
  return db
    .collection('assets')
    .where('projectId', '==', projectId)
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
