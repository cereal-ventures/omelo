import * as firebase from 'firebase/app';
import 'firebase/firestore';

const db = firebase.firestore();

export type UserEmail = string | null | undefined;
export type ProjectId = string | null | undefined;

export function getProjectById(projectId: string, cb: any) {
  return db.doc(`/projects/${projectId}`).onSnapshot(
    snapshot => {
      const data = {
        id: snapshot.id,
        ...snapshot.data()
      };
      cb(data);
    },
    () => {
      window.location.replace('/');
    }
  );
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

type ProjectKey = {
  name?: string;
  isPublic?: boolean;
};

export function updateProject({
  projectId,
  payload
}: {
  projectId: string;
  payload: ProjectKey;
}) {
  return db.doc(`/projects/${projectId}`).update(payload);
}

export function removeProject(projectId: string | undefined) {
  if (projectId) {
    return db.doc(`/projects/${projectId}`).delete();
  }
}

export function getEventsById(id: string, cb: any) {
  return db
    .collection(`/projects/${id}/events`)
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
  date: string;
  completed: boolean;
  isDisabled: boolean;
}) {
  return db.collection(`/projects/${projectId}/events`).add({
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
  return db.doc(`/projects/${projectId}/events/${eventId}`).update(payload);
}

export function removeEvent({
  projectId,
  eventId
}: {
  projectId: string;
  eventId: string;
}) {
  return db.doc(`/projects/${projectId}/events/${eventId}`).delete();
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
  return db.collection(`/projects/${projectId}/assets`).add({
    eventId,
    name,
    type,
    url
  });
}

export function updateAsset({
  projectId,
  assetId,
  name,
  url
}: {
  projectId: string;
  assetId: string;
  name: string;
  url: string;
}) {
  return db.doc(`/projects/${projectId}/assets/${assetId}`).update({
    name,
    url
  });
}

export function removeAsset({
  projectId,
  assetId
}: {
  projectId: string;
  assetId: string;
}) {
  return db.doc(`/projects/${projectId}/assets/${assetId}`).delete();
}

export function getAssetsByEvent(
  {
    projectId,
    eventId
  }: {
    projectId: string;
    eventId: string;
  },
  cb: any
) {
  return db
    .collection(`/projects/${projectId}/assets`)
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
  return db.collection(`project/${projectId}/assets`).onSnapshot(snapshot => {
    const data = snapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      };
    });
    cb(data);
  });
}
