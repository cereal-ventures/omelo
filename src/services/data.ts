import * as firebase from 'firebase/app';
import 'firebase/firestore';

const db = firebase.firestore();
const { fromDate } = firebase.firestore.Timestamp;

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
      window.location.replace('/404');
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
export function addProject({ name }: { name: string }) {
  const user = getCurrentUser();
  const userData = {
    uid: user?.uid,
    email: user?.email,
    displayName: user?.displayName,
    photoUrl: user?.photoURL
  };
  return db.collection('projects').add({
    name,
    role: 'owner',
    users: [userData.email],
    userProfiles: [userData]
  });
}
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
    .onSnapshot(
      snapshot => {
        const data = snapshot.docs.map(doc => {
          const { date, ...rest } = doc.data();
          return {
            id: doc.id,
            date: date.toDate(),
            ...rest
          };
        });
        cb(data);
      },
      e => console.log(e)
    );
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
  const batch = db.batch();
  const projectRef = db.doc(`/projects/${projectId}`);
  batch.update(projectRef, {
    eventCount: firebase.firestore.FieldValue.increment(1)
  });

  const eventsRef = db.collection(`/projects/${projectId}/events`).doc();
  batch.set(eventsRef, {
    title,
    date: fromDate(new Date(date)),
    completed,
    isDisabled
  });
  return batch.commit();
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
  if (payload.date) {
    payload.date = fromDate(new Date(payload.date));
  }
  return db.doc(`/projects/${projectId}/events/${eventId}`).update(payload);
}

export function removeEvent({
  projectId,
  eventId
}: {
  projectId: string;
  eventId: string;
}) {
  const batch = db.batch();
  const projectRef = db.doc(`/projects/${projectId}`);
  batch.update(projectRef, {
    eventCount: firebase.firestore.FieldValue.increment(-1)
  });
  const eventRef = db.doc(`/projects/${projectId}/events/${eventId}`);
  batch.delete(eventRef);
  return batch.commit();
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
    .where('eventId', '==', eventId || '')
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
