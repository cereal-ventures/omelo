import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { getCurrentUser } from '.';
import { activityTypes } from '../constants';

export type UserEmail = string | null | undefined;
export type ProjectId = string | null | undefined;
export type ProjectPermission = 'owner' | 'editor' | 'commenter' | 'viewer';
export type ProjectKey = { name?: string; isPublic?: boolean };
export type Asset = 'link'; // | 'video' | 'image' | 'pdf';

const db = firebase.firestore();
const { fromDate } = firebase.firestore.Timestamp;
const { FieldValue } = firebase.firestore;

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

export function addProject({ name = 'My First Project' }: { name?: string }) {
  const user = getCurrentUser();
  const userData = {
    uid: user?.uid,
    email: user?.email,
    displayName: user?.displayName,
    photoUrl: user?.photoURL,
    permission: 'owner'
  };

  const batch = db.batch();
  const projectRef = db.collection('projects').doc();
  const permissionRef = db.doc(`permissions/${user?.uid}`);

  batch.set(projectRef, {
    name,
    owner: user?.uid,
    users: [userData.email],
    userProfiles: [userData]
  });

  batch.set(
    permissionRef,
    { user: user?.email, [projectRef.id]: 'owner' },
    { merge: true }
  );

  return batch.commit();
}

export async function getProjectPermissions(projectId: string) {
  const user = getCurrentUser();
  return db
    .doc(`/permissions/${user?.uid}`)
    .get()
    .then(snap => {
      const userPermission = snap.data() || {};
      return userPermission[projectId];
    });
}

export function updateUser() {
  const user = getCurrentUser();
  return db.doc(`/users/${user?.uid}`).set({
    displayName: user?.displayName,
    photoURL: user?.photoURL,
    email: user?.email,
    uid: user?.uid
  });
}

export async function validateInvite(inviteId: string) {
  const user = getCurrentUser();
  const invite = await db.doc(`/invites/${inviteId}`).get();
  return invite.exists && user?.email === invite.data()?.email;
}

export async function acceptProjectInvite(inviteId: string) {
  const inviteRef = db.doc(`/invites/${inviteId}`);
  const invite = await inviteRef.get();
  if (!invite.exists) return;

  const user = getCurrentUser();
  const inviteData = invite.data();

  if (inviteData?.email === user?.email) {
    const batch = db.batch();
    const projectRef = db.doc(`/projects/${inviteData?.projectId}`);
    batch.update(projectRef, {
      userProfiles: firebase.firestore.FieldValue.arrayUnion({
        uid: user?.uid,
        email: user?.email,
        displayName: user?.displayName,
        photoUrl: user?.photoURL,
        permission: inviteData?.permission
      }),
      users: firebase.firestore.FieldValue.arrayUnion(user?.email)
    });
    const permissionRef = db.doc(`permissions/${user?.uid}`);
    batch.update(permissionRef, {
      [projectRef.id]: 'owner'
    });
    batch.delete(inviteRef);
    return batch.commit();
  }
}

export async function addUserToProject({
  email,
  projectName,
  projectId,
  permission
}: {
  email: string;
  projectName: string;
  projectId: string;
  permission: ProjectPermission;
}) {
  return db.collection('/invites').add({
    email,
    projectName,
    projectId,
    permission
  });
}

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
    const user = getCurrentUser();
    const batch = db.batch();
    const projectRef = db.doc(`/projects/${projectId}`);
    const permissionRef = db.doc(`permissions/${user?.uid}`);

    batch.delete(projectRef);
    batch.set(
      permissionRef,
      {
        [projectRef.id]: firebase.firestore.FieldValue.delete()
      },
      { merge: true }
    );
    return batch.commit();
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
  const user = getCurrentUser();
  const batch = db.batch();
  const projectRef = db.doc(`/projects/${projectId}`);
  const eventsRef = db.collection(`/projects/${projectId}/events`).doc();
  const activityRef = db
    .collection(`/projects/${projectId}/events/${eventsRef.id}/activity`)
    .doc();

  batch.update(projectRef, {
    eventCount: FieldValue.increment(1)
  });

  batch.set(activityRef, {
    date: fromDate(new Date(Date.now())),
    type: activityTypes.CREATE_EVENT,
    displayName: user?.displayName,
    photoURL: user?.photoURL,
    title
  });

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
  payload,
  type
}: {
  projectId: string;
  eventId: string;
  type: string;
  payload: { [x: string]: any };
}) {
  const user = getCurrentUser();
  const batch = db.batch();
  const eventRef = db.doc(`/projects/${projectId}/events/${eventId}`);
  const activityRef = db
    .collection(`/projects/${projectId}/events/${eventId}/activity`)
    .doc();

  if (type === activityTypes.UPDATE_DATE) {
    const date = new Date(payload.date);
    payload.date = fromDate(date);
    payload.newDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
    payload.prevDate = payload.prevDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }

  let data: { [x: string]: any } = {
    ...payload,
    type,
    date: fromDate(new Date(Date.now())),
    displayName: user?.displayName,
    photoURL: user?.photoURL
  };

  batch.update(eventRef, payload);
  batch.set(activityRef, data);
  return batch.commit();
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
  const batch = db.batch();
  const assetRef = db.collection(`/projects/${projectId}/assets`).doc();
  const eventRef = db.doc(`/projects/${projectId}/events/${eventId}`);
  batch.set(
    assetRef,
    {
      eventId,
      name,
      type,
      url
    },
    { merge: true }
  );

  batch.update(eventRef, {
    assetCount: FieldValue.increment(1)
  });

  return batch.commit();
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
  assetId,
  eventId
}: {
  projectId: string;
  assetId: string;
  eventId: string;
}) {
  const batch = db.batch();
  const assetRef = db.doc(`/projects/${projectId}/assets/${assetId}`);
  const eventRef = db.doc(`/projects/${projectId}/events/${eventId}`);

  batch.delete(assetRef);
  batch.update(eventRef, {
    assetCount: FieldValue.increment(-1)
  });
  return batch.commit();
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

export function addComment({
  projectId,
  eventId,
  comment,
  resolved
}: {
  projectId: string;
  eventId: string;
  comment: string;
  resolved: boolean;
}) {
  const user = getCurrentUser();
  const batch = db.batch();
  const activityRef = db
    .collection(`/projects/${projectId}/events/${eventId}/activity`)
    .doc();
  const eventRef = db.doc(`/projects/${projectId}/events/${eventId}`);
  batch.set(
    activityRef,
    {
      date: fromDate(new Date(Date.now())),
      type: activityTypes.COMMENT,
      comment,
      resolved,
      photoURL: user?.photoURL,
      email: user?.email,
      displayName: user?.displayName
    },
    { merge: true }
  );

  batch.update(eventRef, {
    commentCount: FieldValue.increment(1)
  });

  return batch.commit();
}

export function getEventActivity(
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
    .collection(`/projects/${projectId}/events/${eventId}/activity`)
    .orderBy('date', 'desc')
    .onSnapshot(snapshot => {
      const data = snapshot.docs.map(doc => {
        const data = doc.data();
        const date = data.date.toDate();
        data.date = new Date(date).toLocaleDateString('en-US');
        return {
          id: doc.id,
          ...data
        };
      });
      cb(data);
    });
}

export function removeComment({
  projectId,
  eventId,
  commentId
}: {
  projectId: string;
  eventId: string;
  commentId: string;
}) {
  const batch = db.batch();

  const eventRef = db.doc(`/projects/${projectId}/events/${eventId}`);
  const commentRef = db.doc(
    `/projects/${projectId}/events/${eventId}/activity/${commentId}`
  );

  batch.update(eventRef, {
    commentCount: FieldValue.increment(-1)
  });
  batch.delete(commentRef);

  return batch.commit();
}
